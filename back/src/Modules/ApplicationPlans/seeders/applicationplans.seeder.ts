// src/database/seeders/applicationplans.seeder.ts
import { DataSource } from 'typeorm';
import { ApplicationPlans } from '../entities/applicationplan.entity';
import { ApplicationPlanItem } from '../entities/applicationplan.item.entity';
import { Plantations } from 'src/Modules/Plantations/entities/plantations.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { Recommendation } from 'src/Modules/Recomendations/entities/recomendations.entity';
import { Status } from '../status.enum';

export class ApplicationPlansSeeder {
  constructor(private dataSource: DataSource) {}

  public async run(): Promise<void> {
    const dataSource = this.dataSource;
    const plansRepo = dataSource.getRepository(ApplicationPlans);
    const itemsRepo = dataSource.getRepository(ApplicationPlanItem);
    const plantationsRepo = dataSource.getRepository(Plantations);
    const recommendationsRepo = dataSource.getRepository(Recommendation);
    const usersRepo = dataSource.getRepository(Users);

    const plantations = await plantationsRepo.find();
    const user = await usersRepo.findOneBy({
      email: 'agrotrackproject@gmail.com',
    });

    if (!user || !plantations.length) {
      console.error(
        '⚠️ No se encontraron usuarios o plantaciones. Saltando seeder.',
      );
      return;
    }

    console.log(`\n============================================`);
    console.log(`🚀 Iniciando seeder de planes de aplicación`);
    console.log(`============================================`);
    console.log(`🔎 Total de plantaciones encontradas: ${plantations.length}`);

    for (const plantation of plantations) {
      console.log(
        `\n🔄 Procesando plantación: ${plantation.name} (ID: ${plantation.id})`,
      );
      // ✅ Línea de depuración clave
      console.log(
        `   --> Tipo de cultivo de la plantación: '${plantation.crop_type}'`,
      );

      const existingPlan = await plansRepo.findOne({
        where: { plantation: { id: plantation.id } },
      });

      if (existingPlan) {
        console.log(
          `✅ Plan de aplicación para Plantación ID ${plantation.id} ya existe. Saltando.`,
        );
        continue;
      }

      // Buscar la recomendación específica para el tipo de cultivo
      // ✅ Línea de depuración clave
      console.log(
        `   --> Buscando recomendación para el 'crop_type': '${plantation.crop_type}'`,
      );
      const recommendation = await recommendationsRepo.findOne({
        where: { crop_type: plantation.crop_type },
        relations: ['recommended_diseases', 'recommended_products'],
      });

      // ✅ Línea de depuración clave
      if (recommendation) {
        console.log(
          `   ✅ Recomendación encontrada para '${plantation.crop_type}'.`,
        );
      } else {
        console.warn(
          `⚠️ No se encontró una recomendación para el tipo de cultivo '${plantation.crop_type}'. Asegúrate de que existe en el seeder de recomendaciones.`,
        );
        continue;
      }

      if (recommendation.recommended_diseases.length === 0) {
        console.warn(
          `⚠️ La recomendación para '${plantation.crop_type}' no tiene enfermedades asociadas. Saltando.`,
        );
        continue;
      }

      if (recommendation.recommended_products.length === 0) {
        console.warn(
          `⚠️ La recomendación para '${plantation.crop_type}' no tiene productos asociados. Saltando.`,
        );
        continue;
      }

      // Seleccionar una enfermedad aleatoria de las recomendadas
      const randomIndex = Math.floor(
        Math.random() * recommendation.recommended_diseases.length,
      );
      const diseaseToApply = recommendation.recommended_diseases[randomIndex];

      console.log(`  - Enfermedad seleccionada: ${diseaseToApply.name}`);
      console.log(
        `  - Productos recomendados para esta enfermedad: ${recommendation.recommended_products.map((p) => p.name).join(', ')}`,
      );

      const newPlan = plansRepo.create({
        planned_date: new Date('2025-08-31'),
        total_water:
          recommendation.recommended_water_per_m2 * plantation.area_m2,
        total_product: 0,
        status: Status.PENDING,
        user,
        plantation,
        disease: diseaseToApply,
      });

      const savedPlan = await plansRepo.save(newPlan);
      console.log(
        `✅ Plan creado para Plantación: ${plantation.name} (ID: ${savedPlan.id}) con enfermedad: ${diseaseToApply.name}`,
      );

      let totalProduct = 0;
      for (const recommendedProduct of recommendation.recommended_products) {
        const dosage_per_m2 = 2; // Valor de ejemplo
        const calculated_quantity = dosage_per_m2 * plantation.area_m2;
        totalProduct += calculated_quantity;

        const newItem = itemsRepo.create({
          applicationPlan: savedPlan,
          product: recommendedProduct,
          dosage_per_m2: dosage_per_m2,
          calculated_quantity: calculated_quantity,
        });
        await itemsRepo.save(newItem);
        console.log(
          `↳ Agregado producto: ${recommendedProduct.name} (Cantidad: ${calculated_quantity})`,
        );
      }

      savedPlan.total_product = totalProduct;
      await plansRepo.save(savedPlan);
    }
    console.log(`\n🎉 Seeding de planes de aplicación completado con éxito!`);
  }
}
