import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { ApplicationType } from '../entities/applicationtype.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
export class ApplicationTypesSeeder {
  static async run() {
    const ds: DataSource = connectionSource;
    if (!ds.isInitialized) await ds.initialize();

    const repo = ds.getRepository(ApplicationType);
    const userRepo = ds.getRepository(Users);

    const user = await userRepo.findOneBy({
      email: 'facundo.ortiz@example.com',
    }); // ejemplo
    if (!user) {
      console.error('⚠️ No se encontró usuario admin para asociar');
      await ds.destroy();
      return;
    }
    const filePath = path.join(__dirname, '../data/applicationtypes.json');
    const applicationtypesData: { name: string }[] = JSON.parse(
      fs.readFileSync(filePath, 'utf-8'),
    );

    for (const t of applicationtypesData) {
      const exists = await repo.findOne({ where: { name: t.name } });
      if (!exists) {
        const type = repo.create({ ...t, user });
        await repo.save(type);
      }
    }

    console.log('✅ ApplicationTypes seeded');

    await ds.destroy();
  }
}

if (require.main === module) {
  ApplicationTypesSeeder.run().catch((err) => console.error(err));
}
