import { DataSource } from 'typeorm';
import { Plantations } from '../entities/plantations.entity';
import * as fs from 'fs';
import * as path from 'path';

interface PlantationSeed {
  name: string;
  area_m2: number;
  crop_type: string;
  location: string;
  start_date: string;
}

export class PlantationsSeeder {
  constructor(private dataSource: DataSource) {}

  public async run(): Promise<void> {
    const repo = this.dataSource.getRepository(Plantations);

    const filePath = path.join(__dirname, '../data/plantations.json');
    const plantationsData: PlantationSeed[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );

    for (const p of plantationsData) {
      const exists = await repo.findOne({ where: { name: p.name } });
      if (!exists) {
        const plantation = repo.create({
          name: p.name,
          area_m2: p.area_m2,
          crop_type: p.crop_type,
          location: p.location,
          start_date: new Date(p.start_date),
        });
        await repo.save(plantation);
      }
    }
    console.log('✅ Plantations seeded (new items only)');
  }
}
