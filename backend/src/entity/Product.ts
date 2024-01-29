import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { CartProduct } from './CartProduct';
export class ColumnNumericTransformer {
	to(data: number): number {
		return data;
	}
	from(data: string): number {
		return parseFloat(data);
	}
}
@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column()
	imgUrl!: string; // https://images.pexels.com/photos/14024358/pexels-photo-14024358.jpeg!auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1

	@Column()
	brand!: string;

	@Column('numeric', {
		precision: 7,
		scale: 2,
		transformer: new ColumnNumericTransformer(),
	})
	price!: number;

	@Column()
	color!: string;

	@Column()
	size!: string;

	/**
	 * discount in percentage.
	 * @default 0
	 */
	@Column()
	discount!: number;

	/**
	 * @default false
	 */
	@Column()
	sustainable!: boolean;

	/**
	 * @default false
	 */
	@Column()
	new!: boolean;

	@OneToMany(() => CartProduct, (product) => product.product)
	cartProducts?: Promise<CartProduct[]>;
}
