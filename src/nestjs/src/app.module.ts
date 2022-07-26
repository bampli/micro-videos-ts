import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ConfigModule } from './config/config.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [CategoriesModule, ConfigModule],
})
export class AppModule {}

// NOTE:
// - this would be a simple config with .env file at root folder
// - but we generated ConfigModule with "nest g module config"

// import { ConfigModule } from '@nestjs/config';
// @Module({
//   controllers: [AppController],
//   providers: [AppService],
//   imports: [ConfigModule.forRoot(), CategoriesModule],
// })
