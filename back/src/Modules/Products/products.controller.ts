import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
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
import { AuthGuard } from 'src/Guards/auth.guard';
import { SelfOnlyGuard } from 'src/Guards/selfOnly.guard';
import { PaginatedProductsDto } from './dtos/paginated.products.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @HttpCode(201)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos' })
  @HttpCode(200)
  findAll() {
    return this.productsService.findAll();
  }

  @Get('paginate')
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

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por su ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, SelfOnlyGuard)
  @ApiOperation({ summary: 'Actualizar un producto por su ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, SelfOnlyGuard)
  @ApiOperation({ summary: 'Eliminar un producto por su ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado' })
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
