import { Injectable } from '@angular/core';
import { HttpWrapperService } from './http-wrapper';
import { DataInterface } from './dataInterface';


@Injectable()
export class BddService {
	private bdd = {
		"type": null,
		"series": null,
		"season": null,
		"universe": null,
		"video": null
	};
	private bddPomise = {
		"type": null,
		"series": null,
		"season": null,
		"universe": null,
		"video": null
	};
	private base_local_storage_name = 'yota_karideo_bdd_';
	private use_local_storage = false; // we exceed the limit of 5MB
	
	constructor(private http: HttpWrapperService) {
		console.log("Start BddService");
	}
	
	setAfterPut(_name: string, _id: number, ret: any) {
		let self = this;
		return new Promise((resolve, reject) => {
			self.get(_name)
				.then(function(response:DataInterface) {
					let responseTmp = response;
					ret.then(function(response2) {
						responseTmp.set(_id, response2);
						resolve(response2);
					}).catch(function(response2) {
						reject(response2);
					});
				}).catch(function(response) {
					reject(response);
				});
		});
	}
	asyncSetInDB(_name: string, _id: number, data: any) {
		let self = this;
		self.get(_name)
			.then(function(response:DataInterface) {
				response.set(_id, data);
			}).catch(function(response) {
				// nothing to do ...
			});
	}
	
	delete(_name: string, _id: number, ret: any) {
		let self = this;
		return new Promise((resolve, reject) => {
			self.get(_name)
				.then(function(response:DataInterface) {
					let responseTmp = response;
					ret.then(function(response2) {
						responseTmp.delete(_id);
						resolve(response2);
					}).catch(function(response2) {
						reject(response2);
					});
				}).catch(function(response) {
					reject(response);
				});
		});
	}
	//   https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36/#:~:text=localStorage%20is%20a%20type%20of,browser%20window%20has%20been%20closed.
	get(_name: string): any {
		let self = this;
		console.log("Try to get DB '" + _name + "'");
		if (this.bdd[_name] === undefined) {
			console.log("Try to get a non existant DB ... '" + _name + "'");
			return;
		}
		if (this.bdd[_name] !== null) {
			return new Promise((resolve, reject) => {
				resolve(self.bdd[_name]);
			});
		}
		console.log("get DB:   ??  " + _name + "  ??");
		if (this.bddPomise[_name] == null) {
			this.bddPomise[_name] = new Array<any>();
			// Try to load Local Data (storage)
			let retriveBDDString = null;
			if (this.use_local_storage == true) {
				localStorage.getItem(this.base_local_storage_name + _name);
			}
			if (retriveBDDString !== null) {
				console.log("retrive local bdd string (" + _name + ")= " + retriveBDDString);
				let retriveBDD = JSON.parse(retriveBDDString);
				console.log("retrive local bdd (" + _name + ")= " + retriveBDD);
				let retriveBDDTmp = new DataInterface(_name, retriveBDD);
				self.bdd[_name] = retriveBDDTmp;
				for (let iii=0; iii<self.bddPomise[_name].length; iii++) {
					self.bddPomise[_name][iii]["resolve"](self.bdd[_name]);
				}
				// brut force update of the BDD : TODO optimise it later ...
				console.log("Update BDD (" + _name + ")");
				self.http.get_specific(_name)
				.then(function(response) {
					console.log("end download DB:               ==> " + _name + "     " + response.length);
					self.bdd[_name] = new DataInterface(_name, response);
					localStorage.setItem(self.base_local_storage_name + _name, JSON.stringify(self.bdd[_name].bdd));
				}).catch(function(response) {
					console.log("[E] " + self.constructor.name + ": cant not get data from remote server: " + _name);
				});
			} else {
				console.log("Download BDD (" + _name + ")");
				return new Promise((resolve, reject) => {
					self.http.get_specific(_name)
						.then(function(response) {
							console.log("end download DB:               ==> " + _name + "     " + response.length);// + "   " + JSON.stringify(response).length);
							self.bdd[_name] = new DataInterface(_name, response);
							if (self.use_local_storage == true) {
								localStorage.setItem(self.base_local_storage_name + _name, JSON.stringify(self.bdd[_name].bdd));
							}
							for (let iii=0; iii<self.bddPomise[_name].length; iii++) {
								self.bddPomise[_name][iii]["resolve"](self.bdd[_name]);
							}
							resolve(self.bdd[_name]);
						}).catch(function(response) {
							console.log("[E] " + self.constructor.name + ": can not get data from remote server: " + _name);
							for (let iii=0; iii<self.bddPomise[_name].length; iii++) {
								self.bddPomise[_name][iii]["reject"](response);
							}
							reject(response);
						});
				});
			}
		}
		return new Promise((resolve, reject) => {
			if (self.bdd[_name] != null) {
				resolve(self.bdd[_name]);
				return;
			}
			self.bddPomise[_name].push({"resolve": resolve, "reject": reject});
		});
	}
	
	getType():any {
		return this.get("type");
	}
	
	getSeries():any {
		return this.get("series");
	}
	
	getSeason():any {
		return this.get("season");
	}
	
	getUniverse():any {
		return this.get("universe");
	}
	
	getVideo():any {
		return this.get("video");
	}
}

