import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { Recommendation } from 'src/Modules/Recomendations/entities/recomendations.entity';
import { Diseases } from 'src/Modules/Diseases/entities/diseases.entity';
import { ApplicationType } from 'src/Modules/ApplicationTypes/entities/applicationtype.entity';
import { Products } from 'src/Modules/Products/entities/products.entity';
import * as fs from 'fs';
import * as path from 'path';

interface RecommendationSeed {
  crop_type: string;
  planting_notes: string;
  recommended_water_per_m2: number;
  recommended_fertilizer: string;
  additional_notes: string;
  recommended_diseases: string[];
  recommended_products: string[]; // Actualizado para usar nombres de productos
  recommended_application_type: string;
}

@Injectable()
export class RecommendationsSeeder {
  constructor(private dataSource: DataSource) {}

  public async run(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const recommendationsRepo =
        queryRunner.manager.getRepository(Recommendation);
      const diseasesRepo = queryRunner.manager.getRepository(Diseases);
      const productsRepo = queryRunner.manager.getRepository(Products);
      const applicationTypesRepo =
        queryRunner.manager.getRepository(ApplicationType);

      // Leer los datos del archivo JSON
      const filePath = path.join(__dirname, '../data/recomendations.json');
      const data: RecommendationSeed[] = JSON.parse(
        fs.readFileSync(filePath, 'utf-8'),
      );

      if (!Array.isArray(data)) {
        console.error('⚠️ El archivo JSON de recomendaciones no es un array.');
        return;
      }

      // Obtener todos los productos y mapearlos por nombre para un acceso más rápido
      const allProducts = await productsRepo.find();
      const productMap = new Map<string, Products>();
      allProducts.forEach((p) => productMap.set(p.name, p));

      for (const rec of data) {
        const existingRec = await recommendationsRepo.findOne({
          where: { crop_type: rec.crop_type },
        });

        if (existingRec) {
          console.log(`Recommendation for ${rec.crop_type} already exists.`);
          continue;
        }

        const recommendedDiseases = await diseasesRepo.find({
          where: { name: In(rec.recommended_diseases) },
        });

        // Buscar los productos recomendados por su nombre en el mapa
        const recommendedProducts = rec.recommended_products
          .map((productName) => productMap.get(productName))
          .filter((p): p is Products => p !== undefined);

        // Si la lista de productos está vacía, mostrar una advertencia
        if (recommendedProducts.length === 0) {
          console.warn(
            `⚠️ No se encontraron productos para la recomendación de tipo: "${rec.crop_type}".`,
          );
        }

        const recommendedApplicationType = await applicationTypesRepo.findOne({
          where: { name: rec.recommended_application_type },
        });

        if (!recommendedApplicationType) {
          throw new Error(
            `Application type '${rec.recommended_application_type}' not found`,
          );
        }

        const newRecommendation = recommendationsRepo.create({
          crop_type: rec.crop_type,
          planting_notes: rec.planting_notes,
          recommended_water_per_m2: rec.recommended_water_per_m2,
          recommended_fertilizer: rec.recommended_fertilizer,
          additional_notes: rec.additional_notes,
          recommended_diseases: recommendedDiseases,
          recommended_products: recommendedProducts,
          recommended_application_type: recommendedApplicationType,
        });

        await recommendationsRepo.save(newRecommendation);
        console.log(`Recommendation for ${rec.crop_type} created successfully`);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('❌ Error en RecommendationsSeeder:', err.message);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
