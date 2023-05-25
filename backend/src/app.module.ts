import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApartmentsModule } from './modules/apartments/apartments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDataSource } from '../db/data-source';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './utils/middleware/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards/access-token.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot(appDataSource.options),
    ApartmentsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
