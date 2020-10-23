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
			return new Promise((resolve, reject) => {
				self.http.get_specific(_name)
					.then(function(response) {
						console.log("end download DB:               ==> " + _name + "     " + response.length);
						self.bdd[_name] = new DataInterface(_name, response);
						for (let iii=0; iii<self.bddPomise[_name].length; iii++) {
							self.bddPomise[_name][iii]["resolve"](self.bdd[_name]);
						}
						resolve(self.bdd[_name]);
					}).catch(function(response) {
						console.log("[E] " + self.constructor.name + ": cant not get data from remote server: " + _name);
						for (let iii=0; iii<self.bddPomise[_name].length; iii++) {
							self.bddPomise[_name][iii]["reject"](response);
						}
						reject(response);
					});
			});
		}
		return new Promise((resolve, reject) => {
			if (self.bdd[_name] != null) {
				resolve(self.bdd[_name]);
				return;
			}
			self.bddPomise[_name].push({"resolve": resolve, "reject": reject});
		});
	}
	
	getType():DataInterface {
		return this.get("type");
	}
	
	getSeries():DataInterface {
		return this.get("series");
	}
	
	getSeason():DataInterface {
		return this.get("season");
	}
	
	getUniverse():DataInterface {
		return this.get("universe");
	}
	
	getVideo():DataInterface {
		return this.get("video");
	}
}

