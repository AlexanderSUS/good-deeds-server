import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { configModuleOptions } from './config/configModuleOptions';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
