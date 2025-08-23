import { DataSource } from 'typeorm';
import { ApplicationType } from '../entities/applicationtype.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

interface ApplicationTypeSeed {
  name: string;
  description: string; // Tu JSON no tiene la descripción, pero es buena práctica tenerla
}

export class ApplicationTypesSeeder {
  constructor(private dataSource: DataSource) {}

  public async run(): Promise<void> {
    const ds = this.dataSource;
    const repo = ds.getRepository(ApplicationType);
    const userRepo = ds.getRepository(Users);

    const user = await userRepo.findOneBy({
      email: 'agrotrackproject@gmail.com',
    });
    if (!user) {
      console.error('⚠️ No se encontró usuario admin para asociar');
      return;
    }
    const filePath = path.join(__dirname, '../data/applicationtypes.json');
    const applicationtypesData: ApplicationTypeSeed[] = JSON.parse(
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
  }
}
