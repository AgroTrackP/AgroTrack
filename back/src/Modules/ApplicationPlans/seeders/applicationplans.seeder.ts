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
    const user = await userRepo.findOneBy({ email: 'admin@demo.com' }); // ejemplo
    const plantation = await plantationRepo.findOne({});
    const disease = await diseaseRepo.findOne({});
    const product = await productRepo.findOne({});

    if (!user || !plantation || !disease || !product) {
      console.error('⚠️ No existen las entidades relacionadas necesarias');
      await ds.destroy();
      return;
    }

    // Crear plan si no existe
    let plan = await planRepo.findOne({
      where: { plantation: { id: plantation.id }, disease: { id: disease.id } },
    });

    if (!plan) {
      plan = planRepo.create({
        planned_date: new Date(),
        total_water: 500,
        total_product: 20,
        user,
        plantation,
        disease,
      });
      await planRepo.save(plan);

      // Crear item asociado
      const item = itemRepo.create({
        dosage_per_m2: 2,
        calculated_quantity: 20,
        applicationPlan: plan,
        product,
      });
      await itemRepo.save(item);

      console.log('✅ Plan de aplicación con item creado');
    } else {
      console.log('ℹ️ Ya existía un plan para esa plantación y enfermedad');
    }

    await ds.destroy();
  }
}

if (require.main === module) {
  ApplicationPlansSeeder.run().catch((err) => console.error(err));
}
