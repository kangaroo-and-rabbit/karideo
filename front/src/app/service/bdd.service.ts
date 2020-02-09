import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';
import { DataInterface } from 'app/service/dataInterface';

import { environment } from 'environments/environment';

@Injectable()
export class BddService {
	private bdd = {
		"type": null,
		"group": null,
		"saison": null,
		"univers": null,
		"video": null
	};
	private bddPomise = {
		"type": null,
		"group": null,
		"saison": null,
		"univers": null,
		"video": null
	};
	
	
	constructor(private http: HttpWrapperService) {
		console.log("Start BddService");
	}
	
	setAfterPut(_name: string, _id: number, ret: any) {
		let self = this;
		return new Promise((resolve, reject) => {
			self.get(_name)
				.then(function(response) {
					ret.then(function(response2) {
						response.set(_id, response2);
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
		if (this.bdd[_name] === undefined) {
			console.log("Try to get a non existant BDD ... '" + _name + "'");
			return;
		}
		if (this.bdd[_name] !== null) {
			return new Promise((resolve, reject) => {
				resolve(self.bdd[_name]);
			});
		}
		if (this.bddPomise[_name] == null) {
			this.bddPomise[_name] = new Array<any>();
			return new Promise((resolve, reject) => {
				self.http.get_specific(_name)
					.then(function(response) {
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
	
	getType():any {
		return this.get("type");
	};
	
	getGroup():any {
		return this.get("group");
	};
	
	getSaison():any {
		return this.get("saison");
	};
	
	getUnivers():any {
		return this.get("univers");
	};
	
	getVideo():any {
		return this.get("video");
	};
}

