import 'dotenv/config';
import { DataSource } from 'typeorm';
import 'reflect-metadata';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});