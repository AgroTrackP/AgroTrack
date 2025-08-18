import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { Phenology } from '../entities/phenologies.entity';
import * as fs from 'fs';
import * as path from 'path';

export class PhenologiesSeeder {
  static async run() {
    const dataSource: DataSource = connectionSource;

    if (!dataSource.isInitialized) await dataSource.initialize();

    const repo = dataSource.getRepository(Phenology);

    const filePath = path.join(__dirname, '../data/phenologies.json');
    const phenologiesData: { name: string; description: string }[] = JSON.parse(
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

    await dataSource.destroy();
  }
}

if (require.main === module) {
  PhenologiesSeeder.run().catch((err) => console.error(err));
}
