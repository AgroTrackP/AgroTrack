import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { Diseases } from '../entities/diseases.entity';
import * as fs from 'fs';
import * as path from 'path';

export class DiseasesSeeder {
  static async run() {
    const dataSource: DataSource = connectionSource;

    if (!dataSource.isInitialized) await dataSource.initialize();

    const repo = dataSource.getRepository(Diseases);

    const filePath = path.join(__dirname, '../data/diseases.json');
    const diseasesData: { name: string; description: string }[] = JSON.parse(
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

    await dataSource.destroy();
  }
}

if (require.main === module) {
  DiseasesSeeder.run().catch((err) => console.error(err));
}
