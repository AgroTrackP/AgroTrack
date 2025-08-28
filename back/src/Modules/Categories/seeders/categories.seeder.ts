import { DataSource } from 'typeorm';
import { Categories } from '../entities/categories.entity';
import * as fs from 'fs';
import * as path from 'path';

export class CategoriesSeeder {
  constructor(private dataSource: DataSource) {}

  public async run(): Promise<void> {
    const repo = this.dataSource.getRepository(Categories);

    const filePath = path.join(__dirname, '../data/categories.json');
    const categoriesData: { name: string }[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );

    for (const cat of categoriesData) {
      const exists = await repo.findOne({ where: { name: cat.name } });
      if (!exists) {
        const category = repo.create({ name: cat.name });
        await repo.save(category);
      }
    }
    console.log('✅ Categories seeded (new items only)');
  }
}
