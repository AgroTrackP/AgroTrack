import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../Auth/dtos/CreateUser.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
