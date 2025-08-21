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
    const itemsPath = path.join(
      __dirname,
      '../data/applicationplansitems.json',
    );
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
    const plantations = await plantationRepo.find();
    const diseases = await diseaseRepo.find();
    const products = await productRepo.find();

    if (!user || !plantations.length || !diseases.length || !products.length) {
      console.error('⚠️ No existen las entidades relacionadas necesarias');
      await ds.destroy();
      return;
    }

    // 🔄 Iterar plantaciones → enfermedades → planes
    for (const plantation of plantations) {
      for (const disease of diseases) {
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

            // 🔄 Iterar productos y crear items (circular con itemsData)
            for (let j = 0; j < products.length; j++) {
              const product = products[j];
              const itemSeed = itemsData[j % itemsData.length];

              const item = itemRepo.create({
                dosage_per_m2: itemSeed.dosage_per_m2,
                calculated_quantity: itemSeed.calculated_quantity,
                applicationPlan: plan,
                product,
              });
              await itemRepo.save(item);
            }

            console.log(
              `✅ Plan creado: ${planSeed.planned_date} | Plantación: ${plantation.id} | Enfermedad: ${disease.id} con ${products.length} items`,
            );
          } else {
            console.log(
              `ℹ️ Ya existía un plan para Plantación ${plantation.id} y Enfermedad ${disease.id} en ${planSeed.planned_date}`,
            );
          }
        }
      }
    }

    await ds.destroy();
  }
}

// Ejecutar directamente con ts-node
if (require.main === module) {
  ApplicationPlansSeeder.run().catch((err) => console.error(err));
}
