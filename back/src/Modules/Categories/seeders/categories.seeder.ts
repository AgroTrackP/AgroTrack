import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';
import { Categories } from '../entities/categories.entity';
import * as fs from 'fs';
import * as path from 'path';

export class CategoriesSeeder {
  static async run() {
    const dataSource: DataSource = connectionSource;

    // Inicializar la conexión si no está inicializada
    if (!dataSource.isInitialized) await dataSource.initialize();

    const repo = dataSource.getRepository(Categories);

    // Leer datos del JSON
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

    // Cerrar la conexión
    await dataSource.destroy();
  }
}

// Ejecutar directamente si se corre con ts-node
if (require.main === module) {
  CategoriesSeeder.run().catch((err) => console.error(err));
}
