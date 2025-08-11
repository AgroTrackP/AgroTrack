import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import TypeORMConfig from './Config/TypeORM.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { CloudinaryModule } from './Modules/Cloudinary/cloudinary.module';
import { AuthModule } from './Modules/Auth/auth.module';
import { jwtConfig } from './Config/JWT.config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './Modules/Users/users.module';
import { ProductsModule } from './Modules/Products/products.module';
import { LoggerMiddleware } from './middleware/logger.midleware';
import { StripeModule } from './Modules/Stripe/stripe.module';

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
    CloudinaryModule,
    AuthModule,
    JwtModule.register(jwtConfig),
    UsersModule,
    ProductsModule,
    StripeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
