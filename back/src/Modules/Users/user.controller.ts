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
  BadRequestException,
  Patch,
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
import { ExcludePasswordInterceptor } from 'src/interceptor/exclude-pass.interceptor';
import { PassportJwtAuthGuard } from 'src/Guards/passportJwt.guard';
import { IsActiveGuard } from 'src/Guards/isActive.guard';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';

@ApiTags('Users')
@ApiBearerAuth('jwt')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- 1. Rutas que actúan sobre la colección de usuarios ---
  // GET /users
  @Get()
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @UseInterceptors(ExcludePasswordInterceptor)
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

  @Get('count/active')
  @UseGuards(PassportJwtAuthGuard, RoleGuard, IsActiveGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get the total count of active users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns the total number of active users',
    schema: { example: { activeUsers: 150 } },
  })
  async getActiveUsersCount() {
    const count = await this.usersService.countActiveUsers();
    return { activeUsers: count };
  }

  @Get('admin/users/plantation')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @UseInterceptors(ExcludePasswordInterceptor)
  @ApiOperation({ summary: 'Get all users with Plantations (Admin only)' })
  @ApiResponse({ status: 200, description: 'All users found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAlluserandplantation(
    @Query('page') page: string | null,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
  ): Promise<any> {
    const pageNum = parseInt(page ?? '1');
    const limitNum = parseInt(limit ?? '10');

    // Pasa los nuevos parámetros al servicio
    return await this.usersService.findAlluseradnplantation(
      pageNum,
      limitNum,
      sortBy,
      order,
    );
  }

  @Get('subscription-plan/:id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, SelfOnlyGuard)
  async getSubPlanByUsersId(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.getSubPlanByUserId(id);
  }

  @Put('subscription/:id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user subscription plan (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Subscription plan updated',
    type: UserResponseDto,
  })
  @Roles(Role.Admin)
  async updateSubscription(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return await this.usersService.updateUserSubscription(
      id,
      updateSubscriptionDto.planName,
    );
  }

  @Get('search')
  @UseGuards(PassportJwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  async searchUser(@Query('query') searchTerm: string) {
    if (!searchTerm) {
      throw new BadRequestException('Search term cannot be empty.');
    }
    return await this.usersService.findByEmailOrName(searchTerm);
  }

  // PUT /users/:id/make-admin
  @Put(':id/make-admin')
  @UseGuards(PassportJwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  makeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.setAdminRole(id, true);
  }

  // PUT /users/:id/remove-admin
  @Put(':id/remove-admin')
  @UseGuards(PassportJwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  removeAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.setAdminRole(id, false);
  }

  @ApiBearerAuth('jwt')
  @Get(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, SelfOnlyGuard)
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

  // PUT /users/:id
  @ApiBearerAuth('jwt')
  @Put(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, SelfOnlyGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: UserResponseDto }> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('admin/:id')
  @UseGuards(PassportJwtAuthGuard, RoleGuard, IsActiveGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a user by id (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @Roles(Role.Admin)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUser(id);
  }

  @Delete(':id')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, SelfOnlyGuard)
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a user by id (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.usersService.remove(id);
  }

  @Patch(':id/reactivate')
  @UseGuards(PassportJwtAuthGuard, IsActiveGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Reactivates a user account (Admin only)' })
  @ApiResponse({ status: 200, description: 'User reactivated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async reactivateUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.reactivateUser(id);
  }
}
