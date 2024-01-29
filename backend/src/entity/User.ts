import { Entity, Column, OneToOne, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { CartProduct } from './CartProduct';

@Entity()
export class User {
	@PrimaryColumn()
	public username: string;

	@Column()
	public passwordHash: string;

	@OneToMany(() => CartProduct, (product) => product.user)
	public products?: Promise<CartProduct[]>;

	constructor(username: string, password: string) {
		this.username = username;
		this.passwordHash = password;
	}
}
