import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { ApplicationPlans } from '../entities/applicationplan.entity';
import { ApplicationPlanItem } from '../entities/applicationplan.item.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { Plantations } from 'src/Modules/Plantations/entities/plantations.entity';
import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';

export class ApplicationPlansSeeder {
  static async run() {
    const ds: DataSource = connectionSource;
    if (!ds.isInitialized) await ds.initialize();

    const planRepo = ds.getRepository(ApplicationPlans);
    const itemRepo = ds.getRepository(ApplicationPlanItem);
    const userRepo = ds.getRepository(Users);
    const plantationRepo = ds.getRepository(Plantations);
    const diseaseRepo = ds.getRepository(Diseases);
    const productRepo = ds.getRepository(Products);

    // Buscar entidades relacionadas
    const user = await userRepo.findOneBy({
      email: 'facundo.ortiz@example.com',
    });
    const plantation = await plantationRepo.findOne({
      where: { id: 'f743533e-7d1f-4686-9c41-e5f8721f3037' },
    });
    const disease = await diseaseRepo.findOne({
      where: { id: '15d43a9c-5ea6-4e24-9b2f-123d7225406a' },
    });

    const products = await productRepo.find();

    if (!user || !plantation || !disease || !products.length) {
      console.error('⚠️ No existen las entidades relacionadas necesarias');
      await ds.destroy();
      return;
    }

    // Crear plan si no existe
    let plan = await planRepo.findOne({
      where: { plantation: { id: plantation.id }, disease: { id: disease.id } },
      relations: ['items'],
    });

    if (!plan) {
      plan = planRepo.create({
        planned_date: new Date(),
        total_water: 500,
        total_product: products.length * 10, // ejemplo: total según nº productos
        user,
        plantation,
        disease,
      });
      await planRepo.save(plan);

      // Crear un item para cada producto
      for (const product of products) {
        const item = itemRepo.create({
          dosage_per_m2: 2,
          calculated_quantity: 10,
          applicationPlan: plan,
          product,
        });
        await itemRepo.save(item);
      }

      console.log(`✅ Plan de aplicación creado con ${products.length} items`);
    } else {
      console.log('ℹ️ Ya existía un plan para esa plantación y enfermedad');
    }

    await ds.destroy();
  }
}

if (require.main === module) {
  ApplicationPlansSeeder.run().catch((err) => console.error(err));
}
