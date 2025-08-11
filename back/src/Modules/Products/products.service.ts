import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create.products.dto';
import { UpdateProductDto } from './dtos/update.product.dto';
import { PaginationDto } from './dtos/pagination.dto';
import { PaginatedProductsDto } from './dtos/paginated.products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<{ message: string; product: Products }> {
    try {
      const productExist = await this.productsRepository.findOne({
        where: { name: createProductDto.name },
      });
      if (productExist) {
        throw new BadRequestException(
          `El producto ${createProductDto.name} ya existe.`,
        );
      }
      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);
      return {
        message: 'Producto creado exitosamente',
        product,
      };
    } catch (error) {
      throw new Error(`Error creando el producto: ${error}`);
    }
  }

  async findAll() {
    try {
      return this.productsRepository.find();
    } catch (error) {
      throw new Error(`Error fetching products: ${error}`);
    }
  }

  async paginate(paginationDto: PaginationDto): Promise<PaginatedProductsDto> {
    try {
      const page = paginationDto.page ?? 1;
      const limit = paginationDto.limit ?? 5;

      const [data, total] = await this.productsRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        select: ['id', 'name', 'concentration', 'water_per_liter', 'stock'],
      });

      return {
        data,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(`Error fetching paginated products: ${error}`);
    }
  }

  async findOne(id: string): Promise<Products> {
    try {
      const product = await this.productsRepository.findOneBy({ id });
      if (!product) {
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      }
      return product;
    } catch (error) {
      throw new Error(`Error fetching product: ${error}`);
    }
  }
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<{ message: string; product: Products }> {
    try {
      await this.findOne(id);
      if (
        Object.keys(updateProductDto).length === 0 ||
        !Object.values(updateProductDto).some((value) => value !== undefined)
      ) {
        throw new BadRequestException(
          'Debe enviar al menos un campo para actualizar',
        );
      }

      await this.productsRepository.update(id, updateProductDto);
      return {
        message: 'Producto actualizado correctamente',
        product: await this.findOne(id),
      };
    } catch (error) {
      throw new Error(`Error updating product: ${error}`);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const product = await this.findOne(id);
      if (!product) {
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      }
      await this.productsRepository.update({ id }, { isActive: false });
      return 'Producto eliminado correctamente';
    } catch (error) {
      throw new Error(`Error eliminando el producto: ${error}`);
    }
  }
}
