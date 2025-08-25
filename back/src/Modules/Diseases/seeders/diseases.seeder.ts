import { DataSource } from 'typeorm';
import { Diseases } from '../entities/diseases.entity';
import * as fs from 'fs';
import * as path from 'path';

interface DiseaseSeed {
  name: string;
  description: string;
}

export class DiseasesSeeder {
  constructor(private dataSource: DataSource) {}

  public async run(): Promise<void> {
    const repo = this.dataSource.getRepository(Diseases);

    const filePath = path.join(__dirname, '../data/diseases.json');
    const diseasesData: DiseaseSeed[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );

    for (const d of diseasesData) {
      const exists = await repo.findOne({ where: { name: d.name } });
      if (!exists) {
        const disease = repo.create({
          name: d.name,
          description: d.description,
        });
        await repo.save(disease);
      }
    }
    console.log('✅ Diseases seeded (new items only)');
  }
}
