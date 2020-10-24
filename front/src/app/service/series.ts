import { Injectable } from '@angular/core';
import { HttpWrapperService } from './http-wrapper';
import { DataInterface } from './dataInterface';
import { BddService } from './bdd';


@Injectable()
export class SeriesService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	private serviceName:string = "series";
	
	constructor(private http: HttpWrapperService,
	            private bdd: BddService) {
		console.log("Start SeriesService");
	}
	
	get(_id:number):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getSeries()
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
	}
	
	getData():any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getSeries()
				.then(function(response) {
					let data = response.gets();
					resolve(data);
				}).catch(function(response) {
					console.log("[E] " + self.constructor.name + ": can not retrive BDD values");
					reject(response);
				});
		});
	}
	
	getOrder():any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getSeries()
				.then(function(response) {
					let data = response.gets_where([["!=", "id", null]], ["id", "name"], ["name","id"])
					resolve(data);
				}).catch(function(response) {
					console.log("[E] " + self.constructor.name + ": can not retrive BDD values");
					reject(response);
				});
		});
	}
	
	getVideoAll(_id:number):any {
		//this.checkLocalBdd();
	}
	
	getVideo(_id:number):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					//let data = response.gets_where([["==", "series_id", _id], ["==", "season_id", null]], ["id"], ["episode", "name"])
					let data = response.gets_where([["==", "series_id", _id], ["==", "season_id", null]], undefined, ["episode", "name"])
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	}
	
	getSeason(_id:number, _select:Array<string> = []):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getSeason()
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
	}
	
	put(_id:number, _data:any):any {
		let ret = this.http.put_specific(this.serviceName, _id, _data);
		return this.bdd.setAfterPut(this.serviceName, _id, ret);
	}
		
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	}
	
	getCoverThumbnailUrl(_coverId:number):any {
		return this.http.createRESTCall("data/thumbnail/" + _coverId);
	}
	
	getLike(_nameSeries:string):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getSeries()
				.then(function(response) {
					let data = response.getNameLike(_nameSeries);
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
	deleteCover(_node_id:number,
				_cover_id:number) {
	    let self = this;
		return new Promise((resolve, reject) => {
			self.http.get_specific(this.serviceName + "/" + _node_id + "/rm_cover" , _cover_id)
				.then(function(response) {
					let data = response;
					if (data === null || data === undefined) {
						reject("error retrive data from server");
						return;
					}
					self.bdd.asyncSetInDB(self.serviceName, _node_id, data);
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
		
	}
	uploadCover(_file:File,
				_node_id:number,
			    _progress:any = null) {
	    const formData = new FormData();
	    formData.append('file_name', _file.name);
		formData.append('node_id', _node_id.toString());
	    formData.append('file', _file);
	    let self = this;
		return new Promise((resolve, reject) => {
			self.http.uploadMultipart(this.serviceName + "/" + _node_id + "/add_cover/", formData, _progress)
				.then(function(response) {
					let data = response;
					if (data === null || data === undefined) {
						reject("error retrive data from server");
						return;
					}
					self.bdd.asyncSetInDB(self.serviceName, _node_id, data);
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	}
}

