import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update.user.dto';
import { UserResponseDto } from './dtos/user.response.dto';
import { plainToInstance } from 'class-transformer';

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

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
