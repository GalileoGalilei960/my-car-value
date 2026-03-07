import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/browser';

const config = {
    entities: ['**/*.entity.ts'],
    migrations: [__dirname + '/migrations/*.ts'],
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(config, {
            type: 'sqlite',
            database: 'db.sqlite',
        });
        break;
    case 'test':
        Object.assign(config, {
            type: 'sqlite',
            database: 'test.sqlite',
        });
        break;
    case 'production':
        Object.assign(config, {
            type: 'postgres',
            url: process.env.DATABASE_URL,
        });
        break;
}

export const appDataSource = new DataSource(config as DataSourceOptions);
