import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { Plantations } from '../entities/plantations.entity';
import * as fs from 'fs';
import * as path from 'path';

export class PlantationsSeeder {
  static async run() {
    const dataSource: DataSource = connectionSource;

    // Inicializar la conexión si no está inicializada
    if (!dataSource.isInitialized) await dataSource.initialize();

    const repo = dataSource.getRepository(Plantations);

    // Leer datos del JSON
    const filePath = path.join(__dirname, '../data/plantations.json');
    const plantationsData: {
      name: string;
      area_m2: number;
      crop_type: string;
      location: string;
      start_date: string;
    }[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

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

    await dataSource.destroy();
  }
}

// Ejecutar directamente si se corre con ts-node
if (require.main === module) {
  PlantationsSeeder.run().catch((err) => console.error(err));
}
