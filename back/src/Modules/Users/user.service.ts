import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update.user.dto';
import { UserResponseDto } from './dtos/user.response.dto';
import { Role } from './user.enum';
import { SubscriptionPlan } from '../SubscriptionPlan/entities/subscriptionplan.entity';
import { StripeService } from '../Stripe/stripe.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionRepository: Repository<SubscriptionPlan>,
    private readonly stripeService: StripeService,
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
        relations: [
          'plantations',
          'diseases',
          'applicationPlans',
          'products',
          'applicationTypes',
          'phenologies',
          'suscription_level',
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
      throw new Error(`Error updating user profile image: ${error.message}`);
    }
  }

  async getSubPlanByUserId(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['suscription_level'],
    });
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    try {
      const subscriptionPlan = user.suscription_level;
      if (!subscriptionPlan) {
        return { message: 'This user does not have a active subscription' };
      }
      return {
        userId: user.id,
        plan: subscriptionPlan,
        status: user.subscriptionStatus,
      };
    } catch (error) {
      throw new BadRequestException(
        `Error fetching user subscription plan: ${error}`,
      );
    }
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    try {
      await this.usersRepository.delete(user.id);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting user',
        error.message,
      );
    }
  }

  async findByEmailOrName(query: string): Promise<Users> {
    try {
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.name ILIKE :query OR user.email ILIKE :query', {
          query: `%${query}%`,
        })
        .getOne();

      if (!user) {
        throw new NotFoundException(
          `User with name or email like "${query}" not found.`,
        );
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error searching user by name or email: ${error.message}`,
      );
    }
  }

  async updateSubscription(userId: string, planName: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.stripeCustomerId) {
      throw new NotFoundException(
        'Usuario no encontrado o sin ID de cliente de Stripe.',
      );
    }

    const activeSubscription = await this.stripeService.findActiveSubscription(
      user.stripeCustomerId,
    );

    if (!activeSubscription) {
      throw new NotFoundException(
        'No se encontró una suscripción activa para este usuario.',
      );
    }

    if (planName === 'not subscription') {
      try {
        await this.stripeService.cancelSubscription(activeSubscription.id);
        return {
          message:
            'Solicitud de cancelación enviada a Stripe. El plan se actualizará vía webhook.',
        };
      } catch (error) {
        throw new InternalServerErrorException(
          'Error al cancelar la suscripción en Stripe.',
          error.message,
        );
      }
    }

    const newPlan = await this.subscriptionRepository.findOneBy({
      name: planName,
    });
    if (!newPlan || !newPlan.stripePriceId) {
      throw new NotFoundException(`El plan '${planName}' no fue encontrado.`);
    }

    try {
      await this.stripeService.changeSubscriptionPlan(
        activeSubscription.id,
        newPlan.stripePriceId,
      );

      return {
        message: `Solicitud de cambio al plan '${planName}' enviada a Stripe. El plan se actualizará vía webhook.`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al cambiar el plan de suscripción en Stripe.',
      );
    }
  }
}
