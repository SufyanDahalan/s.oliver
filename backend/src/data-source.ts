import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Product } from './entity/Product';
import { CartProduct } from './entity/CartProduct';
import { Init1707181080256 } from './migrations/1707181080256-Init'




export const AppDataSource = new DataSource({
	type: 'sqlite',
	database: 'db.sqlite',
	synchronize: false,
	logging: false,
	entities: [User, Product, CartProduct],
	migrations: [
		Init1707181080256
	],
	subscribers: [],
	migrationsTableName: 'migrations',
});
