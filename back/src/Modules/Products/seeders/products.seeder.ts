import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { Products } from '../entities/products.entity';
import { Categories } from '../../Categories/entities/categories.entity';
import * as fs from 'fs';
import * as path from 'path';

type ProductSeed = {
  name: string;
  concentration: number;
  water_per_liter: number;
  stock: number;
  alert_threshold: number;
  isActive: boolean;
  categoryName: string;
};

export class ProductsSeeder {
  static async run() {
    const dataSource: DataSource = connectionSource;

    // Inicializar la conexión si no está inicializada
    if (!dataSource.isInitialized) await dataSource.initialize();

    const repo = dataSource.getRepository(Products);
    const categoryRepo = dataSource.getRepository(Categories);

    const filePath = path.join(__dirname, '../data/products.json');
    const productsData: ProductSeed[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );

    for (const prod of productsData) {
      const exists = await repo.findOne({ where: { name: prod.name } });
      if (!exists) {
        // Buscar la categoría correspondiente
        const category = await categoryRepo.findOne({
          where: { name: prod.categoryName },
        });
        if (!category) continue;

        const product = repo.create({
          name: prod.name,
          concentration: prod.concentration,
          water_per_liter: prod.water_per_liter,
          stock: prod.stock,
          alert_threshold: prod.alert_threshold,
          isActive: prod.isActive,
          category: category,
        });

        await repo.save(product);
      }
    }

    console.log('✅ Products seeded (new items only)');

    await dataSource.destroy();
  }
}

// Ejecutar directamente si se corre con ts-node
if (require.main === module) {
  ProductsSeeder.run().catch((err) => console.error(err));
}
