import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper';
import { DataInterface } from 'app/service/dataInterface';
import { BddService } from 'app/service/bdd';

import { environment } from 'environments/environment';

@Injectable()
export class UniversService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	private serviceName:string = "univers";
	
	constructor(private http: HttpWrapperService,
	            private bdd: BddService) {
		console.log("Start universService");
	}
	
	getData():any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getUnivers()
				.then(function(response) {
					let data = response.gets();
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	};
	
	get(_id:number):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getUnivers()
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
	
	getSubGroup(_id:number, _select:Array<string> = []):any {
		//this.checkLocalBdd();
	};
	
	getSubVideo(_id:number, _select:Array<string> = []):any {
		//this.checkLocalBdd();
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
}

