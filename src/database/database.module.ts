import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvVariables } from 'src/config/envVariables.enum';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const username = configService.get(EnvVariables.mongoUserName);
        const password = configService.get(EnvVariables.mongoPassword);
        const database = configService.get(EnvVariables.mongoDatabase);
        const host = configService.get(EnvVariables.mongoHost);

        return {
          uri: `mongodb://${username}:${password}@${host}`,
          dbName: database,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
