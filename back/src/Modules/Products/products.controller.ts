import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create.products.dto';
import { UpdateProductDto } from './dtos/update.product.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from './dtos/pagination.dto';
import { PaginatedProductsDto } from './dtos/paginated.products.dto';
import { Products } from './entities/products.entity';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from '../Users/user.enum';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { IsActiveGuard } from 'src/Guards/isActive.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Crear un nuevo producto
  @Post()
  @UseGuards(PassportJwtAuthGuard, RoleGuard, IsActiveGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @HttpCode(201)
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<{ message: string; product: Products }> {
    return this.productsService.create(createProductDto);
  }

  // Obtener todos los productos.
  @Get()
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos' })
  @HttpCode(200)
  findAll() {
    return this.productsService.findAll();
  }

  // Obtener productos paginados
  @Get('paginate')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  @ApiOperation({ summary: 'Obtener productos paginados' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de productos',
    type: PaginatedProductsDto,
  })
  @HttpCode(200)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página, por defecto 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de items por página, por defecto 5',
  })
  getPaginated(@Query() paginationDto: PaginationDto) {
    return this.productsService.paginate(paginationDto);
  }

  // Obtener un producto por su ID
  @Get(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard)
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // Actualizar un producto por su ID
  @Patch(':id')
  @UseGuards(PassportJwtAuthGuard, RoleGuard, IsActiveGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Actualizar un producto por su ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<{ message: string; product: Products }> {
    return this.productsService.update(id, updateProductDto);
  }

  // Eliminar un producto por su ID
  @Delete(':id')
  @UseGuards(PassportJwtAuthGuard, RoleGuard, IsActiveGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Eliminar un producto por su ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado' })
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<string> {
    return this.productsService.remove(id);
  }
}
