// src/Modules/seed.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { connectionSource } from 'src/Config/TypeORM.config';

// Importa las clases de seeder
import { CategoriesSeeder } from './Categories/seeders/categories.seeder';
import { ProductsSeeder } from './Products/seeders/products.seeder';
import { PlantationsSeeder } from './Plantations/seeders/plantations.seeder';
import { PhenologiesSeeder } from './Phenologies/seeders/phenologies.seeder';
import { DiseasesSeeder } from './Diseases/seeders/diseases.seeder';
import { ApplicationTypesSeeder } from './ApplicationTypes/seeders/applicationtypes.seeder';
import { RecommendationsSeeder } from './Recomendations/seeders/recomendations.seeder';
import { ApplicationPlansSeeder } from './ApplicationPlans/seeders/applicationplans.seeder';

// Importa las entidades para la limpieza de la base de datos
import { ApplicationPlanItem } from './ApplicationPlans/entities/applicationplan.item.entity';
import { ApplicationPlans } from './ApplicationPlans/entities/applicationplan.entity';
import { Recommendation } from './Recomendations/entities/recomendations.entity';
import { Products } from './Products/entities/products.entity';
import { ApplicationType } from './ApplicationTypes/entities/applicationtype.entity';
import { Phenology } from './Phenologies/entities/phenologies.entity';
import { Diseases } from './Diseases/entities/diseases.entity';
import { Plantations } from './Plantations/entities/plantations.entity';
import { Categories } from './Categories/entities/categories.entity';

/**
 * Esta función elimina todos los datos de las tablas en el orden correcto para evitar
 * problemas de claves foráneas.
 * @param dataSource La instancia de la conexión a la base de datos.
 */
async function clearDatabase(dataSource: DataSource): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Eliminar los datos de todas las tablas con un solo comando TRUNCATE...CASCADE
    // Esto es mucho más robusto para PostgreSQL y evita errores de clave foránea.
    const entities = [
      ApplicationPlanItem,
      ApplicationPlans,
      Recommendation,
      Products,
      ApplicationType,
      Phenology,
      Diseases,
      Plantations,
      Categories,
    ];

    const tableNames = entities
      .map((entity) => `"${dataSource.getMetadata(entity).tableName}"`)
      .join(', ');

    await queryRunner.query(
      `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`,
    );

    await queryRunner.commitTransaction();
    console.log('🗑️ Base de datos limpiada exitosamente.');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

// Esta función será llamada desde main.ts
export async function runSeeders() {
  let dataSource: DataSource | undefined = undefined;

  try {
    if (!connectionSource.isInitialized) {
      dataSource = await connectionSource.initialize();
    } else {
      dataSource = connectionSource;
    }

    console.log('🔗 Conexión a la base de datos establecida.');

    // Ejecutar la limpieza de la base de datos antes de sembrar
    await clearDatabase(dataSource);

    // Llama a los seeders en el orden correcto
    await new CategoriesSeeder(dataSource).run();
    await new ProductsSeeder(dataSource).run();
    await new PlantationsSeeder(dataSource).run();
    await new PhenologiesSeeder(dataSource).run();
    await new DiseasesSeeder(dataSource).run();
    await new ApplicationTypesSeeder(dataSource).run();

    // **¡CAMBIO AQUÍ!** Ejecuta RecommendationsSeeder antes que ApplicationPlansSeeder.
    await new RecommendationsSeeder(dataSource).run();
    await new ApplicationPlansSeeder(dataSource).run();

    console.log('🎉 Todos los seeders se completaron exitosamente.');
  } catch (error) {
    console.error('❌ Error al ejecutar los seeders:', error);
  } finally {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🚪 Conexión a la base de datos cerrada.');
    }
  }
}

// Bloque para ejecutar la siembra directamente con un comando si es necesario
if (require.main === module) {
  runSeeders().catch((error) => {
    console.error(error);
  });
}
