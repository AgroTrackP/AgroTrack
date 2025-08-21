import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { ApplicationPlans } from '../entities/applicationplan.entity';
import { ApplicationPlanItem } from '../entities/applicationplan.item.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { Plantations } from 'src/Modules/Plantations/entities/plantations.entity';
import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';
import * as fs from 'fs';
import * as path from 'path';

interface PlanSeed {
  planned_date: string;
  total_water: number;
  total_product: number;
  status: string;
}

interface PlanItemSeed {
  dosage_per_m2: number;
  calculated_quantity: number;
}

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

    // Leer JSONs
    const plansPath = path.join(__dirname, '../data/applicationplans.json');
    const itemsPath = path.join(__dirname, '../data/applicationitems.json');
    const plansData: PlanSeed[] = JSON.parse(
      fs.readFileSync(plansPath, 'utf-8'),
    );
    const itemsData: PlanItemSeed[] = JSON.parse(
      fs.readFileSync(itemsPath, 'utf-8'),
    );

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

    for (let i = 0; i < plansData.length; i++) {
      const planSeed = plansData[i];

      // Verificar si ya existe un plan similar
      let plan = await planRepo.findOne({
        where: {
          plantation: { id: plantation.id },
          disease: { id: disease.id },
          planned_date: new Date(planSeed.planned_date),
        },
        relations: ['items'],
      });

      if (!plan) {
        plan = planRepo.create({
          planned_date: new Date(planSeed.planned_date),
          total_water: planSeed.total_water,
          total_product: planSeed.total_product,
          status: planSeed.status as any,
          user,
          plantation,
          disease,
        });
        await planRepo.save(plan);

        // Crear items de forma flexible: cada producto recibe un item del JSON (circular si menos items que productos)
        for (let j = 0; j < products.length; j++) {
          const product = products[j];
          const itemSeed = itemsData[j % itemsData.length]; // Repetir si hay menos items que productos

          const item = itemRepo.create({
            dosage_per_m2: itemSeed.dosage_per_m2,
            calculated_quantity: itemSeed.calculated_quantity,
            applicationPlan: plan,
            product,
          });
          await itemRepo.save(item);
        }

        console.log(
          `✅ Plan de aplicación creado para ${planSeed.planned_date} con ${products.length} items`,
        );
      } else {
        console.log(
          `ℹ️ Ya existía un plan para la plantación y enfermedad en ${planSeed.planned_date}`,
        );
      }
    }

    await ds.destroy();
  }
}

// Ejecutar directamente con ts-node
if (require.main === module) {
  ApplicationPlansSeeder.run().catch((err) => console.error(err));
}
