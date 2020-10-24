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
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
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

