import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper';
import { DataInterface } from 'app/service/dataInterface';
import { BddService } from 'app/service/bdd';

import { environment } from 'environments/environment';

@Injectable()
export class GroupService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	private serviceName:string = "group";
	
	constructor(private http: HttpWrapperService,
	            private bdd: BddService) {
		console.log("Start GroupService");
	}
	
	get(_id:number):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getGroup()
				.then(function(response) {
					let data = response.get(_id);
					if (data === null || data === undefined) {
						reject("Data does not exist in the local BDD");
						return;
					}
					resolve(data);
					return;
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	
	getData():any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getGroup()
				.then(function(response) {
					let data = response.gets();
					resolve(data);
				}).catch(function(response) {
					console.log("[E] " + self.constructor.name + ": can not retrive BDD values");
					reject(response);
				});
		});
	};
	
	getOrder():any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getGroup()
				.then(function(response) {
					let data = response.gets_where([["!=", "id", null]], ["id", "name"], ["name","id"])
					resolve(data);
				}).catch(function(response) {
					console.log("[E] " + self.constructor.name + ": can not retrive BDD values");
					reject(response);
				});
		});
	};
	
	getVideoAll(_id:number):any {
		//this.checkLocalBdd();
	};
	
	getVideo(_id:number):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					//let data = response.gets_where([["==", "serie_id", _id], ["==", "saison_id", null]], ["id"], ["episode", "name"])
					let data = response.gets_where([["==", "serie_id", _id], ["==", "saison_id", null]], undefined, ["episode", "name"])
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	
	getSaison(_id:number, _select:Array<string> = []):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getSaison()
				.then(function(response) {
					let data = response.gets_where([["==", "parent_id", _id]], ["id"], ["number"])
					if (_select.length == 0) {
						resolve(data);
						return;
					}
					if (_select[0] == "*") {
						let data2 = response.gets_where([["==", "id", data]], undefined, ["number"])
						resolve(data2);
						return;
					}
					let data3 = response.gets_where([["==", "id", data]], _select, ["number"]);
					resolve(data3);
					return;
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	
	put(_id:number, _data:any):any {
		let ret = this.http.put_specific(this.serviceName, _id, _data);
		return this.bdd.setAfterPut(this.serviceName, _id, ret);
	};
	
	addCover(_id:number, _coverId:number):any {
		return this.http.post_specific(this.serviceName, _id, {"data_id":_coverId}, "add_cover");
	};
	
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	};
	getCoverThumbnailUrl(_coverId:number):any {
		return this.http.createRESTCall("data/thumbnail/" + _coverId);
	};
	
	getLike(_nameGroup:string):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getGroup()
				.then(function(response) {
					let data = response.getNameLike(_nameGroup);
					if (data === null || data === undefined) {
						reject("Data does not exist in the local BDD");
						return;
					}
					resolve(data);
					return;
				}).catch(function(response) {
					reject(response);
				});
		});
	}
}

