import { Module } from '@nestjs/common';
import { CloudinaryConfig } from 'src/Config/Cloudinary.config';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { UsersModule } from '../Users/users.module';

@Module({
  imports: [UsersModule],
  providers: [CloudinaryConfig, CloudinaryService],
  controllers: [CloudinaryController],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
