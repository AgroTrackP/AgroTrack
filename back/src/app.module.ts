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
import { PlantationsModule } from './Modules/Plantations/plantations.module';
import { ApplicationPlansModule } from './Modules/ApplicationPlans/applicationplans.module';
import { ApplicationTypesModule } from './Modules/ApplicationTypes/applicationTypes.module';
import { DiseasesModule } from './Modules/Diseases/diseases.module';
import { PhenologiesModule } from './Modules/Phenologies/phenologies.module';

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
    PlantationsModule,
    DiseasesModule,
    ApplicationPlansModule,
    ApplicationTypesModule,
    PhenologiesModule,
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
