import { DataSource } from 'typeorm';
import { Phenology } from '../entities/phenologies.entity';
import * as fs from 'fs';
import * as path from 'path';

interface PhenologySeed {
  name: string;
  description: string;
}

export class PhenologiesSeeder {
  constructor(private dataSource: DataSource) {}

  public async run(): Promise<void> {
    const repo = this.dataSource.getRepository(Phenology);

    const filePath = path.join(__dirname, '../data/phenologies.json');
    const phenologiesData: PhenologySeed[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );

    for (const ph of phenologiesData) {
      const exists = await repo.findOne({ where: { name: ph.name } });
      if (!exists) {
        const phenology = repo.create({
          name: ph.name,
          description: ph.description,
        });
        await repo.save(phenology);
      }
    }
    console.log('✅ Phenologies seeded (new items only)');
  }
}
