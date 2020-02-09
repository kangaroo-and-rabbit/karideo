import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';
//import { SHA512 } from 'assets/js_3rd_party/sha512';
import { DataInterface } from 'app/service/dataInterface';
import { BddService } from 'app/service/bdd.service';


import { environment } from 'environments/environment';

export interface MessageLogIn {
	id: number;
	name: string;
	description: string;
};

declare function SHA512(param1: any): any;
declare function dateFormat(param1: any, param2: any): any;

@Injectable()
export class TypeService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	private serviceName:string = "type";
	
	constructor(private http: HttpWrapperService,
	            private bdd: BddService) {
		console.log("Start TypeService");
	}
	
	
	
	getData():any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName);
		}
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getType()
				.then(function(response) {
					let data = response.gets();
					resolve(data);
				}).catch(function(response) {
					console.log("[E] " + self.constructor.name + ": can not retrive BDD values");
					reject(response);
				});
		});
	};
	
	get(_id:number):any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, _id);
		}
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getType()
				.then(function(response) {
					let data = response.get(_id);
					if (data === null || data === undefined) {
						reject("Data does not exist in the local BDD");
						return;
					}
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	
	getSubVideo(_id:number, _select:Array<string> = []):any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, _id, "video", _select);
		}
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					let data = response.gets_where([["==", "type_id", _id], ["==", "group_id", null], ["==", "univers_id", null]], ["id"], ["name"]);
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	
	getSubGroup(_id:number, _select:Array<string> = []):any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, _id, "group", _select);
		}
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					let data = response.gets_where([["==", "type_id", _id], ["!=", "group_id", null], ["==", "univers_id", null]], ["group_id"], ["name"]);
					if (_select.length == 0) {
						resolve(data);
						return;
					}
					self.bdd.getGroup()
						.then(function(response2) {
							if (_select[0] == "*") {
								let data2 = response2.gets_where([["==", "id", data]], undefined, ["name"]);
								resolve(data2);
								return;
							}
							let data3 = response2.gets_where([["==", "id", data]], _select, ["name"]);
							resolve(data3);
							return;
						}).catch(function(response2) {
							reject(response2);
						});
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	
	getSubUnivers(_id:number, _select:Array<string> = []):any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, _id, "univers", _select);
		}
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					let data = response.data.gets_where([["==", "type_id", _id], ["==", "group_id", null], ["==", "univers_id", null]], ["univers_id"], ["name"]);
					if (_select.length == 0) {
						resolve(data);
						return;
					}
					self.bdd.getUnivers()
						.then(function(response2) {
							if (_select[0] == "*") {
								let data2 = response2.gets_where([["==", "id", data]], undefined, ["name"]);
								resolve(data2);
								return;
							}
							let data3 = response2.gets_where([["==", "id", data]], _select, ["name"]);
							resolve(data3);
							return;
						}).catch(function(response2) {
							reject(response2);
						});
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	};
}

