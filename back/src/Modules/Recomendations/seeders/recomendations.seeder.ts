import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { Recommendation } from '../entities/recomendations.entity';
import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';
import { ApplicationType } from 'src/Modules/ApplicationTypes/entities/applicationtype.entity';
import { RecommendationSeed } from 'src/types/recomendation.seed.interface';
import * as fs from 'fs';
import * as path from 'path';

export class RecommendationsSeeder {
  static async run() {
    const ds: DataSource = connectionSource;
    if (!ds.isInitialized) await ds.initialize();

    const repo = ds.getRepository(Recommendation);
    const diseaseRepo = ds.getRepository(Diseases);
    const productRepo = ds.getRepository(Products);
    const appTypeRepo = ds.getRepository(ApplicationType);

    const filePath = path.join(__dirname, '../data/recomendations.json');
    const recommendationsData: RecommendationSeed[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );

    for (const r of recommendationsData) {
      const exists = await repo.findOne({ where: { crop_type: r.crop_type } });
      if (exists) continue;

      // Buscar enfermedades por nombre
      const diseases = await diseaseRepo.find({
        where: r.recommended_diseases.map((name) => ({ name })),
      });
      console.log(diseases, 'diseases found');

      // Buscar productos por nombre
      const products = await productRepo.find({
        where: r.recommended_products.map((name) => ({ name })),
      });

      // Buscar tipo de aplicación por nombre
      const appType = await appTypeRepo.findOne({
        where: { name: r.recommended_application_type },
      });

      if (!appType) {
        throw new Error(
          `ApplicationType "${r.recommended_application_type}" no encontrado`,
        );
      }

      const recommendation = repo.create({
        crop_type: r.crop_type,
        planting_notes: r.planting_notes,
        recommended_water_per_m2: r.recommended_water_per_m2,
        recommended_fertilizer: r.recommended_fertilizer,
        recommended_diseases: diseases,
        recommended_products: products,
        recommended_application_type: appType,
        additional_notes: r.additional_notes,
      });

      await repo.save(recommendation);
    }

    console.log('✅ Recommendations seeded correctamente');

    await ds.destroy();
  }
}

if (require.main === module) {
  RecommendationsSeeder.run().catch((err) => console.error(err));
}
