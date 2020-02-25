import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';
import { DataInterface } from 'app/service/dataInterface';
import { BddService } from 'app/service/bdd.service';

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
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, _id);
		}
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
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	getOrder():any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, null, "", ["name","id"]);
		}
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getGroup()
				.then(function(response) {
					let data = response.gets_where([["!=", "id", null]], ["id"], ["name","id"])
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	
	getVideoAll(_id:number):any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, _id, "video_all");
		}
		//this.checkLocalBdd();
	};
	
	getVideo(_id:number):any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, _id, "video");
		}
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					let data = response.gets_where([["==", "serie_id", _id], ["==", "saison_id", null]], ["id"], ["episode", "name"])
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	
	getSaison(_id:number, _select:Array<string> = []):any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, _id, "saison", _select);
		}
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
		if (environment.localBdd != true) {
			return ret;
		}
		return this.bdd.setAfterPut(this.serviceName, _id, ret);
	};
	
	addCover(_id:number, _coverId:number):any {
		return this.http.post_specific(this.serviceName, _id, {"data_id":_coverId}, "add_cover");
	};
	
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	};
}

