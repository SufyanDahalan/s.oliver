import http, { IncomingMessage, ServerResponse } from "http";
import { Sequelize } from 'sequelize';
// Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:sufian.db') // Example for sqlite
// Option 2: Passing parameters separately (sqlite)


  
import { DefaultController, ProductController } from "./controllers";
import jwt from "jsonwebtoken";
import path from "path";

const defaultController = new DefaultController("");
const productController = new ProductController("product");

function trimTrailingSlash(url: string): string {
	return url.endsWith("/") ? url.slice(0, -1) : url;
}
const secret: string = "tempSecret!"; // TODO get it from dotenv or smth.

const server = http.createServer(async(request: IncomingMessage, response: ServerResponse) => {
	const sequelize = new Sequelize({
		dialect: 'sqlite',
		host: 'localhost',
		storage: path.join(process.cwd(), "./db.sqlite")
	  });
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	  } catch (error) {
		console.error('Unable to connect to the database:', error);
	  }
	const X = JSON.stringify;
	console.log(request.url);
	console.log([request.method?.toUpperCase(), trimTrailingSlash(request.url!)]);

	//#region Parse the body if there is one
	let body: any[] = [];
	let parsedBody: any;
	request.on("data", (chunk: any) => body.push(chunk));
	request.on("end", () => {
		if (request.headers["content-type"] === "application/json") {
			parsedBody = JSON.parse(Buffer.concat(body).toString());
		}
	});
	//#endregion

	//#region Controllers
	switch (X([request.method?.toUpperCase(), trimTrailingSlash(request.url ?? "")])) {
		case X(["POST", "/auth/register"]): {
			let username: string, password: string, passwordConfirmation;
			try {
				username = parsedBody.username;
				password = parsedBody.password;
				passwordConfirmation = parsedBody.passwordConfirmation;
			} catch (error) {
				response.writeHead(500, { "Content-Type": "text/plain" });
				response.write("Parameters required but not found: 'username', 'password', 'passwordConfirmation'.");
				response.end();
				break;
			}

			// save username and password in db and generate token to send it to user
			let userToken: string = jwt.sign(username, secret, { expiresIn: "1800s" });
			response.writeHead(200, { "Content-Type": "application/json" });
			response.write(
				JSON.stringify({
					token: userToken,
				})
			);
			response.end();
			break;
		}
		case X(["GET", "/auth/login"]): {
			let username: string, password: string;
			try {
				username = parsedBody.username;
				password = parsedBody.password;
			} catch (error) {
				response.writeHead(500, { "Content-Type": "text/plain" });
				response.write("Parameters required but not found: 'username', 'password'.");
				response.end();
				break;
			}
			// Check username and password in DB
			let userToken: string = jwt.sign(username, secret, { expiresIn: "1800s" });
			response.writeHead(200, { "Content-Type": "application/json" });
			response.write(
				JSON.stringify({
					token: userToken,
				})
			);
			response.writeHead(200, { "Content-Type": "text/plain" });
			response.write("/auth/register!");
			response.end();
			break;
		}
			
		default: {
			response.writeHead(400, { "Content-Type": "text/plain" });
			response.write("404 Not Found!");
			response.end();
			break;
		}
	}
	if (request.method?.toUpperCase() === "POST") productController.POST(request, response);
	else defaultController.POST(request, response);
	console.log("defaultcontroller name: ", DefaultController.name);
});
server.listen(9000, () => {
	console.log("Server is running on Port 9000");
});
// interface app {
// 	post: Dictionary<>
// }
