import 'dotenv/config';
import { connectionSource } from 'src/Config/TypeORM.config';
import { CategoriesSeeder } from './Categories/seeders/categories.seeder';
import { ProductsSeeder } from './Products/seeders/products.seeder';
async function runSeeders() {
  await connectionSource.initialize();

  await CategoriesSeeder.run(connectionSource);
  await ProductsSeeder.run(connectionSource);

  console.log('🎉 All seeders completed');
  process.exit(0);
}

runSeeders().catch((err) => {
  console.error(err);
  process.exit(1);
});
