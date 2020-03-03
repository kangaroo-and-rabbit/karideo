import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
	private modals: any[] = [];
	
	constructor() {
		console.log("Start Modal Service");
	}
	
	add(_modal: any) {
		// add modal to array of active modals
		this.modals.push(_modal);
	}
	
	remove(_id: string) {
		// remove modal from array of active modals
		//let modalToRemove = _.findWhere(this.modals, { id: id });
		//this.modals = _.without(this.modals, modalToRemove);
	}
	
	open(_id: string) {
		console.log("Try to open pop-in: '" + _id + "'");
		// open modal specified by id
		for (let iii=0; iii<this.modals.length; iii++) {
			if (this.modals[iii].id == _id) {
				console.log("    ==>find it ...");
				this.modals[iii].open();
				return;
			}
		}
		console.log("    ==> NOT found     !!!!!");
	}
	
	close(_id: string) {
		// close modal specified by id
		for (let iii=0; iii<this.modals.length; iii++) {
			if (this.modals[iii].id == _id) {
				this.modals[iii].close();
				return;
			}
		}
	}
}