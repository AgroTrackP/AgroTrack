import { DataSource } from 'typeorm';
import { Categories } from '../entities/categories.entity';
import * as fs from 'fs';
import * as path from 'path';

export class CategoriesSeeder {
  static async run(dataSource: DataSource) {
    const repo = dataSource.getRepository(Categories);
    const count = await repo.count();
    if (count > 0) return; // ya está poblado

    const filePath = path.join(__dirname, '../data/categories.json');
    const categoriesData: { name: string }[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );

    for (const cat of categoriesData) {
      const category = repo.create({ name: cat.name });
      await repo.save(category);
    }

    console.log('✅ Categories seeded');
  }
}
