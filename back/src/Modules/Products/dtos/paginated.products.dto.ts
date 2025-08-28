import { ApiProperty } from '@nestjs/swagger';
import { Products } from '../entities/products.entity';

export class PaginatedProductsDto {
  @ApiProperty({ type: [Products] })
  data: Products[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;
}
