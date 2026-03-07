import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}
    createTypeOrmOptions(): TypeOrmModuleOptions {
        const dbConfig: TypeOrmModuleOptions = {
            synchronize: false,
            migrations: [__dirname + '/../migrations/*.ts'],
            migrationsRun: true,
            autoLoadEntities: true,
        };

        switch (process.env.NODE_ENV) {
            case 'development':
                Object.assign(dbConfig, {
                    type: 'sqlite',
                    database: this.configService.get<string>('DB_NAME'),
                });
                break;
            case 'test':
                Object.assign(dbConfig, {
                    type: 'sqlite',
                    database: this.configService.get<string>('DB_NAME'),
                });
                break;
            case 'production':
                console.log('we are in production');

                Object.assign(dbConfig, {
                    type: 'postgres',
                    url: process.env.DATABASE_URL,
                });
                break;
            default:
                throw new Error('enviroment is not provided');
        }

        return dbConfig;
    }
}
