import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';
import { DataInterface } from 'app/service/dataInterface';
import { environment } from 'environments/environment';
import { BddService } from 'app/service/bdd.service';

@Injectable()
export class SaisonService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	private serviceName:string = "saison";
	
	constructor(private http: HttpWrapperService,
	            private bdd: BddService) {
		console.log("Start SaisonService");
	}
	
	
	get(_id:number):any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, _id);
		}
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getSaison()
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
	getVideo(_id:number):any {
		if (environment.localBdd != true) {
			return this.http.get_specific(this.serviceName, _id, "video");
		}
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getVideo()
				.then(function(response) {
					let data = response.gets_where([["==", "saison_id", _id]], ["id"], ["episode", "name"])
					resolve(data);
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

