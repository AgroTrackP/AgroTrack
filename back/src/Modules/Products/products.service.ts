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

  async create(createProductDto: CreateProductDto): Promise<Products> {
    try {
      const product = this.productsRepository.create(createProductDto);
      return await this.productsRepository.save(product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al crear el producto: ${error.message}`,
        );
      }
      throw new BadRequestException('Error desconocido al crear el producto');
    }
  }

  async findAll(): Promise<Products[]> {
    try {
      return await this.productsRepository.find();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al obtener productos: ${error.message}`,
        );
      }
      throw new BadRequestException('Error desconocido al obtener productos');
    }
  }

  async paginate(paginationDto: PaginationDto): Promise<PaginatedProductsDto> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 5;

    if (limit < 1) {
      throw new BadRequestException('El límite debe ser al menos 1');
    }
    if (limit > 100) {
      throw new BadRequestException('El límite no puede ser mayor a 100');
    }
    if (page < 1) {
      throw new BadRequestException('La página debe ser mayor o igual a 1');
    }

    try {
      const [data, total] = await this.productsRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al paginar productos: ${error.message}`,
        );
      }
      throw new BadRequestException('Error desconocido al paginar productos');
    }
  }

  async findOne(id: string): Promise<Products> {
    try {
      const product = await this.productsRepository.findOneBy({ id });
      if (!product) {
        throw new NotFoundException(`Producto con id ${id} no encontrado`);
      }
      return product;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al buscar el producto: ${error.message}`,
        );
      }
      throw new BadRequestException('Error desconocido al buscar el producto');
    }
  }
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Products> {
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
      return this.findOne(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al actualizar el producto: ${error.message}`,
        );
      }
      throw new BadRequestException(
        'Error desconocido al actualizar el producto',
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.productsRepository.delete(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al eliminar el producto: ${error.message}`,
        );
      }
      throw new BadRequestException(
        'Error desconocido al eliminar el producto',
      );
    }
  }
}
