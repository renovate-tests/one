import { Injectable } from '@nuclei/core';

@Injectable()
export class MoreNestService {

	public hello() {
		console.log(`Hello from ${this.constructor.name}`);
	}

}
