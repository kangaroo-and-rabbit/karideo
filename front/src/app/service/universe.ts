import { Injectable } from '@angular/core';
import { HttpWrapperService } from './http-wrapper';
import { DataInterface } from './dataInterface';
import { BddService } from './bdd';

@Injectable()
export class UniverseService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	private serviceName:string = "universe";
	
	constructor(private http: HttpWrapperService,
	            private bdd: BddService) {
		console.log("Start universeService");
	}
	
	getData():any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getUniverse()
				.then(function(response) {
					let data = response.gets();
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	}
	
	get(_id:number):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.getUniverse()
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
	
	getSubSeries(_id:number, _select:Array<string> = []):any {
		//this.checkLocalBdd();
	}
	
	getSubVideo(_id:number, _select:Array<string> = []):any {
		//this.checkLocalBdd();
	}
	
	put(_id:number, _data:any):any {
		let ret = this.http.put_specific(this.serviceName, _id, _data);
		return this.bdd.setAfterPut(this.serviceName, _id, ret);
	}
	addCover(_id:number, _coverId:number):any {
		return this.http.post_specific(this.serviceName, _id, {"data_id":_coverId}, "add_cover");
	}
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	}
}

