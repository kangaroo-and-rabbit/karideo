import { Injectable } from '@angular/core';

@Injectable()
export class PopInService {
	private popins: any[] = [];
	
	constructor() {
		console.log("Start PopIn Service");
	}
	
	add(_popin: any) {
		// add popin to array of active popins
		this.popins.push(_popin);
	}
	
	remove(_id: string) {
		// remove popin from array of active popins
		//let popinToRemove = _.findWhere(this.popins, { id: id });
		//this.popins = _.without(this.popins, popinToRemove);
	}
	
	open(_id: string) {
		console.log("Try to open pop-in: '" + _id + "'");
		// open popin specified by id
		for (let iii=0; iii<this.popins.length; iii++) {
			if (this.popins[iii].id == _id) {
				console.log("    ==>find it ...");
				this.popins[iii].open();
				return;
			}
		}
		console.log("    ==> NOT found     !!!!!");
	}
	
	close(_id: string) {
		// close popin specified by id
		for (let iii=0; iii<this.popins.length; iii++) {
			if (this.popins[iii].id == _id) {
				this.popins[iii].close();
				return;
			}
		}
	}
}