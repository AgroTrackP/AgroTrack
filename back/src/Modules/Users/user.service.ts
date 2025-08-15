import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update.user.dto';
import { UserResponseDto } from './dtos/user.response.dto';
import { plainToInstance } from 'class-transformer';
import { Role } from './user.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  /*async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);
    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
    };
  }*/

  async findAll(
    pageNum = 1,
    limitNum = 10,
  ): Promise<{
    data: UserResponseDto[];
    pageNum: number;
    limitNum: number;
    total: number;
  }> {
    try {
      const [data, total] = await this.usersRepository.findAndCount({
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        select: ['id', 'name', 'email', 'created_at'],
        relations: [
          'plantations',
          'diseases',
          'applicationPlans',
          'products',
          'applicationTypes',
          'phenologies',
        ],
      });

      return { data, pageNum, limitNum, total };
    } catch (error) {
      throw new Error(`Error fetching users: ${error}`);
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: {
          plantations: true,
          products: true,
          diseases: true,
          applicationPlans: true,
          applicationTypes: true,
          phenologies: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error}`);
    }
  }

  async setAdminRole(id: string, makeAdmin: boolean) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.role = makeAdmin ? Role.Admin : Role.User;
    await this.usersRepository.save(user);

    return {
      message: makeAdmin
        ? 'Usuario ahora es admin'
        : 'Usuario ahora es usuario',
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: UserResponseDto }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    try {
      await this.usersRepository.update(id, updateUserDto);
      return {
        message: 'User updated successfully',
        user: await this.findOne(id),
      };
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User not found`);
      }
      await this.usersRepository.update({ id }, { isActive: false });
      return {
        message: 'User deleted successfully',
      };
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }
  async updateUserProfileImage(
    userId: string,
    { url, public_id }: { url: string; public_id: string },
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    try {
      // Actualizamos con la nueva imagen
      return await this.usersRepository.update(userId, {
        imgUrl: url,
        imgPublicId: public_id,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Error updating user profile image: ${error.message}`);
    }
  }
}
