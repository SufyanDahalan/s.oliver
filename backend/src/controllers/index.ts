import { IncomingMessage, ServerResponse } from "http";

interface IDefaultController {
	path: string;
	POST(request: IncomingMessage, response: ServerResponse): void;
	DELETE(request: IncomingMessage, response: ServerResponse): void;
	GET(request: IncomingMessage, response: ServerResponse): void;
	PUT(request: IncomingMessage, response: ServerResponse): void;
}

export class DefaultController implements IDefaultController {
	path: string;
	constructor(path: string) {
		this.path = path;
	}
	POST(request: IncomingMessage, response: ServerResponse): void {}
	DELETE(request: IncomingMessage, response: ServerResponse): void {}
	GET(request: IncomingMessage, response: ServerResponse): void {}
	PUT(request: IncomingMessage, response: ServerResponse): void {}
}

export class ProductController extends DefaultController {
	constructor(path: string) {
		super(path);
	}
	POST(request: IncomingMessage, response: ServerResponse): void {
		// console.log("START: Got a POST request in ProductController");
		// console.log("END: Got a POST request in ProductController");
	}
}
export function registerController(): void {
	
}

/**
 * each method should have path and method
 * or each controller has 4 methods and handles only one path
 */
