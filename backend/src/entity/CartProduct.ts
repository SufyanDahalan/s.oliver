import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Product } from './Product';
import { User } from './User';

@Entity()
export class CartProduct {
	@PrimaryGeneratedColumn()
	public id!: number;
	@JoinTable()
	@ManyToOne(() => Product, (product) => product.cartProducts)
	product!: Promise<Product>;

	@Column()
	public quantity!: number;

	@ManyToOne(() => User, (user) => user.products)
	public user!: Promise<User>;
}
