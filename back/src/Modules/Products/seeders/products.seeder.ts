import { DataSource } from 'typeorm';
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
  categoryName: string; // Nombre de la categoría para relacionar
};

export class ProductsSeeder {
  static async run(dataSource: DataSource) {
    const repo = dataSource.getRepository(Products);
    const count = await repo.count();
    if (count > 0) return; // ya está poblado

    const filePath = path.join(__dirname, '../data/products.json');
    const productsData: ProductSeed[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );
    const categoryRepo = dataSource.getRepository(Categories);

    for (const prod of productsData) {
      const category = await categoryRepo.findOneBy({
        name: prod.categoryName,
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

    console.log('✅ Products seeded');
  }
}
