import 'dotenv/config';
import { connectionSource } from 'src/Config/TypeORM.config';
import { CategoriesSeeder } from './Categories/seeders/categories.seeder';
import { ProductsSeeder } from './Products/seeders/products.seeder';
import { PlantationsSeeder } from './Plantations/seeders/plantations.seeder';
import { PhenologiesSeeder } from './Phenologies/seeders/phenologies.seeder';
import { DiseasesSeeder } from './Diseases/seeders/diseases.seeder';
import { ApplicationTypesSeeder } from './ApplicationTypes/seeders/applicationtypes.seeder';
import { ApplicationPlansSeeder } from './ApplicationPlans/seeders/applicationplans.seeder';

export async function runSeeders() {
  await connectionSource.initialize();

  await CategoriesSeeder.run();
  await ProductsSeeder.run();
  await PlantationsSeeder.run();
  await PhenologiesSeeder.run();
  await DiseasesSeeder.run();
  await ApplicationTypesSeeder.run();
  await ApplicationPlansSeeder.run();

  console.log('🎉 All seeders completed');
}
