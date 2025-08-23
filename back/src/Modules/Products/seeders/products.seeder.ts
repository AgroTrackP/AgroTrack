import { DataSource } from 'typeorm';
import { Products } from '../entities/products.entity';
import { Categories } from '../../Categories/entities/categories.entity';
import * as fs from 'fs';
import * as path from 'path';

interface ProductSeed {
  name: string;
  concentration: number;
  water_per_liter: number;
  stock: number;
  alert_threshold: number;
  isActive: boolean;
  categoryName: string;
}

export class ProductsSeeder {
  constructor(private dataSource: DataSource) {}

  public async run(): Promise<void> {
    const repo = this.dataSource.getRepository(Products);
    const categoryRepo = this.dataSource.getRepository(Categories);

    const filePath = path.join(__dirname, '../data/products.json');
    const productsData: ProductSeed[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );

    for (const prod of productsData) {
      const exists = await repo.findOne({ where: { name: prod.name } });
      if (!exists) {
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
  }
}
