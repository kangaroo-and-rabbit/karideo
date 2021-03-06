import { Injectable } from '@angular/core';
import { HttpWrapperService } from './http-wrapper';
import { DataInterface } from './dataInterface';
import { BddService } from './bdd';



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
	}
	
	get(_id:number):any {
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
	}

	countVideo(_id:number):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					let data = response.gets_where([["==", "type_id", _id]], undefined, undefined)
					resolve(data.length);
				}).catch(function(response) {
					reject(response);
				});
		});
	}
	
	getSubVideo(_id:number, _select:Array<string> = []):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					if (_select.length == 0) {
						let data = response.gets_where([["==", "type_id", _id], ["==", "series_id", null], ["==", "universe_id", null]], undefined, ["name"]);
						resolve(data);
						return;
					}
					if (_select[0] == "*") {
						let data = response.gets_where([["==", "type_id", _id], ["==", "series_id", null], ["==", "universe_id", null]], undefined, ["name"]);
						resolve(data);
						return;
					}
					let data = response.gets_where([["==", "type_id", _id], ["==", "series_id", null], ["==", "universe_id", null]], _select, ["name"]);
					resolve(data);
					return;
				}).catch(function(response) {
					reject(response);
				});
		});
	}
	
	getSubSeries(_id:number, _select:Array<string> = []):any {
		let self = this;
		/*
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					let data = response.gets_where([["==", "type_id", _id], ["!=", "series_id", null], ["==", "universe_id", null]], ["series_id"], ["name"]);
					if (_select.length == 0) {
						resolve(data);
						return;
					}
					self.bdd.getSeries()
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
		*/
		return new Promise((resolve, reject) => {
			self.bdd.getSeries()
				.then(function(response) {
					let data = response.gets_where([["==", "parent_id", _id]], undefined, ["name"]);
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	}
	
	getSubUniverse(_id:number, _select:Array<string> = []):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					let data = response.data.gets_where([["==", "type_id", _id], ["==", "series_id", null], ["==", "universe_id", null]], ["univers_id"], ["name"]);
					if (_select.length == 0) {
						resolve(data);
						return;
					}
					self.bdd.getUniverse()
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
	}
	
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	}
	getCoverThumbnailUrl(_coverId:number):any {
		return this.http.createRESTCall("data/thumbnail/" + _coverId);
	}
}

