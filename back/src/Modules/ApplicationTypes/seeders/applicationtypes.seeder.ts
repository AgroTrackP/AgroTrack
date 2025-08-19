import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { ApplicationType } from '../entities/applicationtype.entity';
import { Users } from 'src/Modules/Users/entities/user.entity';

export class ApplicationTypesSeeder {
  static async run() {
    const ds: DataSource = connectionSource;
    if (!ds.isInitialized) await ds.initialize();

    const repo = ds.getRepository(ApplicationType);
    const userRepo = ds.getRepository(Users);

    const user = await userRepo.findOneBy({ email: 'admin@demo.com' }); // ejemplo
    if (!user) {
      console.error('⚠️ No se encontró usuario admin para asociar');
      await ds.destroy();
      return;
    }

    const types = [
      {
        name: 'Preventiva',
        description: 'Aplicación antes de síntomas',
      },
      {
        name: 'Curativa',
        description: 'Aplicación tras aparición de síntomas',
      },
    ];

    for (const t of types) {
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
