import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { ApplicationPlans } from '../entities/applicationplan.entity';
import { ApplicationPlanItem } from '../entities/applicationplan.item.entity';
import { Plantations } from 'src/Modules/Plantations/entities/plantations.entity';
import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { Status } from '../status.enum';
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
    const dataSource: DataSource = connectionSource;
    if (!dataSource.isInitialized) await dataSource.initialize();

    const plansRepo = dataSource.getRepository(ApplicationPlans);
    const itemsRepo = dataSource.getRepository(ApplicationPlanItem);
    const plantationsRepo = dataSource.getRepository(Plantations);
    const diseasesRepo = dataSource.getRepository(Diseases);
    const productsRepo = dataSource.getRepository(Products);
    const usersRepo = dataSource.getRepository(Users);

    // Lee los archivos JSON
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

    // Busca las entidades relacionadas
    const plantations = await plantationsRepo.find();
    const diseases = await diseasesRepo.find();
    const products = await productsRepo.find();
    const user = await usersRepo.findOneBy({
      email: 'facundo.ortiz@example.com',
    });

    if (
      !user ||
      !plantations.length ||
      !diseases.length ||
      !products.length ||
      !plansData.length ||
      !itemsData.length
    ) {
      console.error(
        '⚠️ No se encontraron las entidades o datos JSON necesarios.',
      );
      await dataSource.destroy();
      return;
    }

    // Lógica para crear un plan por plantación si no existe
    for (const plantation of plantations) {
      // 1. Busca un plan existente para esta plantación
      const existingPlan = await plansRepo.findOne({
        where: { plantation: { id: plantation.id } },
      });

      // 2. Si el plan ya existe, simplemente salta al siguiente
      if (existingPlan) {
        console.log(
          `✅ Plan de aplicación para Plantación ID ${plantation.id} ya existe. Saltando.`,
        );
        continue;
      }

      // Si el plan no existe, lo crea
      const planSeedData = plansData[0];
      const disease = diseases[0];

      const newPlan = plansRepo.create({
        planned_date: new Date(planSeedData.planned_date),
        total_water: planSeedData.total_water,
        total_product: planSeedData.total_product,
        status: planSeedData.status as Status,
        user,
        plantation,
        disease,
      });

      const savedPlan = await plansRepo.save(newPlan);
      console.log(
        `✅ Plan creado para Plantación: ${plantation.id} con ID: ${savedPlan.id}`,
      );

      // Crea los ítems del plan
      for (let i = 0; i < products.length && i < itemsData.length; i++) {
        const itemSeedData = itemsData[i];
        const product = products[i];

        const newItem = itemsRepo.create({
          applicationPlan: savedPlan,
          product,
          dosage_per_m2: itemSeedData.dosage_per_m2,
          calculated_quantity: itemSeedData.calculated_quantity,
        });
        await itemsRepo.save(newItem);
        // eslint-disable-next-line no-irregular-whitespace
        console.log(`    ✅ Ítem creado para producto: ${product.name}`);
      }
    }

    console.log('✅ Proceso de siembra de ApplicationPlans completado.');
    await dataSource.destroy();
  }
}

if (require.main === module) {
  ApplicationPlansSeeder.run().catch((err) => console.error(err));
}
