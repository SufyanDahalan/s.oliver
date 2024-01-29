import 'reflect-metadata';
import * as http from 'http';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { Product } from './entity/Product';
import { CartProduct } from './entity/CartProduct';
import path from 'path';
import fs from 'fs';

//#region define helper functions

function GET(route = ''): string {
	return JSON.stringify(['GET', route]);
}
function DELETE(route = ''): string {
	return JSON.stringify(['DELETE', route]);
}
function PUT(route = ''): string {
	return JSON.stringify(['PUT', route]);
}
function POST(route = ''): string {
	return JSON.stringify(['POST', route]);
}

function trimTrailingSlash(url: string): string {
	return url.endsWith('/') ? url.slice(0, -1) : url;
}

//#endregion

//#region variable definitions

const { sign, verify } = jwt,
	password = 'Admin@123';

const secret = process.env.NODE_DEV_SECRET!,
	salt = Buffer.from(process.env.NODE_DEV_SALT!, 'base64').toString(); ;

let activeSessions: { id: string; token: string }[] = [];

//#endregion

await AppDataSource.initialize();

const server = http.createServer(async (request: http.IncomingMessage, response: http.ServerResponse) => {
	//#region Parse the body if there is one
	const body: any[] = [];
	let parsedBody: any;
	request.on('data', (chunk: any) => body.push(chunk));
	request.on('end', async () => {
		if (request.headers['content-type'] === 'application/json') {
			parsedBody = JSON.parse(Buffer.concat(body).toString());
		}
		//#endregion
		await handleRequest(request, response, parsedBody);
	});
});

server.listen(9000, () => {
	console.log('Server is running on Port 9000');
});

//#region Controllers
async function handleRequest(request: http.IncomingMessage, response: http.ServerResponse, parsedBody: any) {
	switch (JSON.stringify([request.method?.toUpperCase(), trimTrailingSlash(request.url ?? '')])) {
		case POST('/auth/register'): {
			let username: string, password: string, passwordConfirmation: string;
			try {
				username = parsedBody.username;
				password = parsedBody.password;

				const userToken: string = sign({ username: username }, secret, { expiresIn: 1800 });
				const passwordHash = await bcrypt.hash(password, salt);
				const user = new User(username, passwordHash);
				await AppDataSource.manager.save(user);

				response.writeHead(200, { 'content-type': 'application/json' });
				response.write(JSON.stringify({ token: userToken }));
				break;
			} catch (error) {
				response.writeHead(500, { 'content-type': 'text/plain' });
				response.write("Parameters required but not found: 'username', 'password', 'passwordConfirmation'.");
				break;
			}
		}

		case POST('/auth/login'): {
			let username: string, password: string;
			try {
				username = parsedBody.username;
				password = parsedBody.password;
			} catch (error) {
				response.writeHead(500, { 'content-type': 'text/plain' });
				response.write("Parameters required but not found: 'username', 'password'.");
				break;
			}
			try {
				const user: User = await AppDataSource.getRepository(User).createQueryBuilder('user').where('user.username = :userme').setParameter('userme', username).getOneOrFail();
				if ((await bcrypt.hash(password, salt)) === user.passwordHash) {
					const userToken: string = sign({ username: username }, secret, { expiresIn: 1800 });
					response.writeHead(200, { 'content-type': 'application/json' });
					response.write(JSON.stringify({ token: userToken }));
					activeSessions.push({ id: user.username, token: userToken });
				} else {
					response.writeHead(401, { 'content-type': 'text/plain' });
					response.write('Password incorrect!');
				}
			} catch (error) {
				response.writeHead(401, { 'content-type': 'text/plain' });
				response.write('User not found');
			}
			break;
		}

		case GET('/auth/logout'): {
			let userSessionEntry = activeSessions.find((s) => s.token === request.headers.authorization);
			if (userSessionEntry) {
				// if false, nothing to do here. Return 200 cause the user is not logged in.
				activeSessions = activeSessions.filter((s) => s.id === userSessionEntry?.id);
			}
			response.writeHead(200, { 'content-type': 'application/json' });
			break;
		}
		case GET('/cart/products'): {
			try {
				let userSessionEntry = activeSessions.find((s) => s.token === request.headers.authorization);
				if (!userSessionEntry) {
					response.writeHead(401);
					break;
				}
				let user: User = await AppDataSource.getRepository(User).createQueryBuilder('user').where('username = :username').setParameters({ username: userSessionEntry.id }).getOneOrFail(),
					userCartProducts: CartProduct[] | undefined = await user.products;

				let userProducts: {
					id: number;
					product: Product;
					quantity: number;
				}[] = [];
				if (userCartProducts !== undefined)
					for (let i = 0; i < userCartProducts.length; i++) {
						userProducts.push({
							id: userCartProducts[i].id,
							product: await userCartProducts[i].product,
							quantity: userCartProducts[i].quantity,
						});
					}
				response.writeHead(200);
				response.write(JSON.stringify(userProducts));
			} catch (error) {
				console.log('error: ', error);
				response.writeHead(500);
				break;
			}
			break;
		}
		case POST('/cart/products/increase'): {
			try {
				let userSessionEntry = activeSessions.find((s) => s.token === request.headers.authorization);
				if (!userSessionEntry) {
					response.writeHead(401);
				}
				let productId = parsedBody.productId,
					user: User = await AppDataSource.getRepository(User).createQueryBuilder('user').where('username = :username').setParameters({ username: userSessionEntry!.id }).getOneOrFail(),
					userCartProducts: CartProduct[] | undefined = await user.products,
					userProducts: Product[] = [];

				if (!userCartProducts || userCartProducts.length === 0) {
					response.writeHead(200); // no product to increase quantity of
					break;
				}

				for (let i = 0; i < userCartProducts.length; i++) {
					userProducts.push(await userCartProducts[i].product);
				}
				let index = userProducts.findIndex((p) => p.id === productId);
				if (index > -1) {
					userCartProducts[index].quantity++;
					await AppDataSource.manager.save(userCartProducts[index]);
				}
				response.writeHead(200);
			} catch (error) {
				response.writeHead(401);
				break;
			}
			break;
		}
		case POST('/cart/products/decrease'): {
			try {
				let userSessionEntry = activeSessions.find((s) => s.token === request.headers.authorization);
				if (!userSessionEntry) {
					response.writeHead(401);
				}
				let productId = parsedBody.productId,
					user: User = await AppDataSource.getRepository(User).createQueryBuilder('user').where('username = :username').setParameters({ username: userSessionEntry!.id }).getOneOrFail(),
					userCartProducts: CartProduct[] | undefined = await user.products,
					userProducts: Product[] = [];

				if (!userCartProducts || userCartProducts.length === 0) {
					response.writeHead(200); // no product to decrease quantity of
					break;
				}

				for (let i = 0; i < userCartProducts.length; i++) {
					userProducts.push(await userCartProducts[i].product);
				}
				let index = userProducts.findIndex((p) => p.id === productId);
				if (index > -1) {
					userCartProducts[index].quantity--;
					await AppDataSource.manager.save(userCartProducts[index]);
				}
				response.writeHead(200);
			} catch (error) {
				response.writeHead(401);
				break;
			}
			break;
		}
		case POST('/cart/products/delete'): {
			try {
				let userSessionEntry = activeSessions.find((s) => s.token === request.headers.authorization);
				if (!userSessionEntry) {
					response.writeHead(401);
				}
				let productId = parsedBody.productId,
					user: User = await AppDataSource.getRepository(User).createQueryBuilder('user').where('username = :username').setParameters({ username: userSessionEntry!.id }).getOneOrFail(),
					userCartProducts: CartProduct[] | undefined = await user.products,
					userProducts: Product[] = [];

				if (!userCartProducts || userCartProducts.length === 0) {
					response.writeHead(200); // no product to decrease quantity of
					break;
				}
				for (let i = 0; i < userCartProducts.length; i++) {
					userProducts.push(await userCartProducts[i].product);
				}
				let index = userProducts.findIndex((p) => p.id === productId);
				if (index > -1) {
					userCartProducts[index].quantity = 0;
					await AppDataSource.manager.save(userCartProducts[index]);
				}
				response.writeHead(200);
			} catch (error) {
				response.writeHead(401);
				break;
			}
			break;
		}
		case GET('/cart/products/addrandom'): {
			try {
				let userSessionEntry = activeSessions.find((s) => s.token === request.headers.authorization);
				if (!userSessionEntry) {
					response.writeHead(401);
				}
				let user: User = await AppDataSource.getRepository(User).createQueryBuilder('user').where('username = :username').setParameters({ username: userSessionEntry!.id }).getOneOrFail();
				let userCartProducts: CartProduct[] | undefined;
				userCartProducts = (await user.products) || [];
				const allProducts = await AppDataSource.manager.find(Product);
				let newRandomProductIndex: number = Math.floor(Math.random() * allProducts.length);
				let userProducts: Array<Product> = [];
				for (let i = 0; i < userCartProducts.length; i++) {
					userProducts.push(await userCartProducts[i].product);
				}
				let index = userProducts.findIndex((p) => p.id === allProducts[newRandomProductIndex].id);
				if (index > -1) {
					userCartProducts[index].quantity++;
					await AppDataSource.manager.save(userCartProducts[index]);
				} else {
					let newProductToAdd: CartProduct = new CartProduct();
					newProductToAdd.product = Promise.resolve(allProducts[newRandomProductIndex]);
					newProductToAdd.quantity = 1;
					newProductToAdd.user = Promise.resolve(user);
					userCartProducts.push(newProductToAdd);
					await AppDataSource.manager.save(newProductToAdd);
				}
				response.writeHead(200);
			} catch (error) {
				console.log('error: ', error);
				response.writeHead(500);
				break;
			}
			break;
		}
		case GET('STATIC/'): {
			fs.readFile(__dirname + path, function (error, data) {
				if (error) {
					response.writeHead(404);
					response.write(error);
					response.end();
				} else {
					response.writeHead(200, { 'Content-Type': 'text/html' });
					response.write(data);
					response.end();
				}
			});
			break;
		}
		default: {
			response.writeHead(400, { 'content-type': 'text/plain' });
			response.write('404 Not Found!');
			break;
		}
	}

	response.end();
}
//#endregion
