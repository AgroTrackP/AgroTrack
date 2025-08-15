import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpCode,
  UseGuards,
  Query,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { UpdateUserDto } from './dtos/update.user.dto';
import { SelfOnlyGuard } from 'src/Guards/selfOnly.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './dtos/user.response.dto';
import { RoleGuard } from 'src/Guards/role.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { Role } from './user.enum';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { ExcludePasswordInterceptor } from 'src/interceptor/exclude-pass.interceptor';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Retornamos todos los usuarios paginados
  @ApiBearerAuth('jwt')
  @Get()
  @UseGuards(PassportJwtAuthGuard, RoleGuard) // ✅ Solo usamos RoleGuard
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'All users found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query('page') page: string | null,
    @Query('limit') limit?: string,
  ): Promise<{
    data: UserResponseDto[];
    pageNum: number;
    limitNum: number;
    total: number;
  }> {
    const pageNum = parseInt(page ?? '1');
    const limitNum = parseInt(limit ?? '10');

    return await this.usersService.findAll(pageNum, limitNum);
  }

  // Retornamos un usuario por su ID
  @ApiBearerAuth('jwt')
  @Get(':id')
  @UseGuards(PassportJwtAuthGuard, SelfOnlyGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  // Actualizamos un usuario por su ID
  @Put(':id')
  @UseGuards(PassportJwtAuthGuard, SelfOnlyGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  @HttpCode(200)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: UserResponseDto }> {
    return await this.usersService.update(id, updateUserDto);
  }

  // convierte user en admin
  @Put(':id/make-admin')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  makeAdmin(@Param('id') id: string) {
    return this.usersService.setAdminRole(id, true);
  }

  // remueve admin a un user
  @Put(':id/remove-admin')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  removeAdmin(@Param('id') id: string) {
    return this.usersService.setAdminRole(id, false);
  }

  // Eliminamos un usuario por su ID
  @ApiBearerAuth('jwt')
  @Delete('delete/:id')
  @UseGuards(PassportJwtAuthGuard, SelfOnlyGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.usersService.remove(id);
  }
}
