import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Products } from 'src/Modules/Products/entities/products.entity';
import { Categories } from 'src/Modules/Categories/entities/categories.entity';
import * as fs from 'fs';
import * as path from 'path';

interface ProductSeed {
  name: string;
  concentration: number;
  water_per_liter: number;
  stock: number;
  alert_threshold: number;
  category_name: string;
  isActive: boolean;
}

@Injectable()
export class ProductsSeeder {
  constructor(private dataSource: DataSource) {}

  public async run(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productsRepo = queryRunner.manager.getRepository(Products);
      const categoryRepo = queryRunner.manager.getRepository(Categories);

      // Leemos los datos desde el archivo JSON
      const filePath = path.join(__dirname, '../data/products.json');
      const productsData: ProductSeed[] = JSON.parse(
        fs.readFileSync(filePath, 'utf-8'),
      );

      if (!Array.isArray(productsData)) {
        console.error('⚠️ El archivo JSON de productos no es un array.');
        return;
      }

      // Creamos un mapa de categorías para un acceso rápido.
      const categories = await categoryRepo.find();
      const categoryMap = new Map<string, Categories>();
      categories.forEach((cat) => categoryMap.set(cat.name, cat));

      for (const productData of productsData) {
        const existingProduct = await productsRepo.findOne({
          where: { name: productData.name },
        });

        if (!existingProduct) {
          // Buscamos la categoría en el mapa.
          const category = categoryMap.get(productData.category_name);

          // Si la categoría existe, creamos el producto.
          if (category) {
            const newProduct = productsRepo.create({
              ...productData,
              category: category, // Asociamos el objeto de categoría completo.
            });
            await productsRepo.save(newProduct);
            console.log(`✅ Producto creado: ${newProduct.name}`);
          } else {
            // Si la categoría no existe, lo notificamos y lo saltamos.
            console.warn(
              `⚠️ La categoría "${productData.category_name}" no fue encontrada. Saltando el producto "${productData.name}".`,
            );
          }
        } else {
          console.log(
            `⚠️ El producto ${existingProduct.name} ya existe. Saltando.`,
          );
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('❌ Error en ProductsSeeder:', err.message);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
