import { Module } from '@nestjs/common';
import { CloudinaryConfig } from 'src/Config/Cloudinary.config';

@Module({
  imports: [],
  providers: [CloudinaryConfig],
  controllers: [],
  exports: [],
})
export class CloudinaryModule {}
