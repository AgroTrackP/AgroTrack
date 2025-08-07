import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import TypeORMConfig from './Config/TypeORM.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
<<<<<<< HEAD
import { CloudinaryModule } from './Modules/Cloudinary/cloudinary.module';
=======
import { AuthModule } from './Modules/Auth/auth.module';
import { jwtConfig } from './Config/JWT.config';
import { JwtModule } from '@nestjs/jwt';
>>>>>>> f28435d8675becd019da55471989a8579aded7c5

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeORMConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<DataSourceOptions>('typeorm');
        return {
          ...config,
          autoLoadEntities: true,
        };
      },
    }),
<<<<<<< HEAD
    CloudinaryModule,
=======
    AuthModule,
    JwtModule.register(jwtConfig),
>>>>>>> f28435d8675becd019da55471989a8579aded7c5
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
