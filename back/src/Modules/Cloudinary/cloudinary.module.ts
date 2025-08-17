import { Module } from '@nestjs/common';
import { CloudinaryConfig } from 'src/Config/Cloudinary.config';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { UsersModule } from '../Users/users.module';
import { AuthModule } from '../Auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  providers: [CloudinaryService, CloudinaryConfig],
  controllers: [CloudinaryController],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
