import { Injectable } from '@angular/core';
import { HttpWrapperService } from './http-wrapper';
import { DataInterface } from './dataInterface';
import { BddService } from './bdd';

import { environment } from '../../environments/environment';

@Injectable()
export class VideoService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	private serviceName:string = "video";
	
	
	constructor(private http: HttpWrapperService,
	            private bdd: BddService) {
		console.log("Start VideoService");
	}
	
	get(_id:number):any {
		let self = this;
		return new Promise((resolve, reject) => {
			self.bdd.get(this.serviceName)
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
	
	put(_id:number, _data:any):any {
		let ret = this.http.put_specific(this.serviceName, _id, _data);
		return this.bdd.setAfterPut(this.serviceName, _id, ret);
	}
	delete(_id:number):any {
		let ret = this.http.delete_specific(this.serviceName, _id);
		return this.bdd.delete(this.serviceName, _id, ret);
	}
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	}
	getCoverThumbnailUrl(_coverId:number):any {
		return this.http.createRESTCall("data/thumbnail/" + _coverId);
	}

	uploadFile(_file:File,
			   _universe:string,
			   _series:string,
			   _season:number,
			   _episode:number,
			   _title:string,
			   _type_id:number,
			   _progress:any = null) {
	    const formData = new FormData();
	    formData.append('file_name', _file.name);
	    formData.append('universe', _universe);
	    formData.append('series', _series);
	    if (_season != null) {
	    	formData.append('season', _season.toString());
	    } else {
	    	formData.append('season', null);
	    }
	    
	    if (_episode != null) {
	    	formData.append('episode', _episode.toString());
	    } else {
	    	formData.append('episode', null);
	    }
	    formData.append('title', _title);

	    if (_type_id != null) {
	    	formData.append('type_id', _type_id.toString());
	    } else {
    		formData.append('type_id', null);
	    }
	    formData.append('file', _file);
		return this.http.uploadMultipart(this.serviceName + "/upload/", formData, _progress);
	}

	deleteCover(_media_id:number,
				_cover_id:number) {
	    let self = this;
		return new Promise((resolve, reject) => {
			self.http.get_specific(this.serviceName + "/" + _media_id + "/rm_cover" , _cover_id)
				.then(function(response) {
					let data = response;
					if (data === null || data === undefined) {
						reject("error retrive data from server");
						return;
					}
					self.bdd.asyncSetInDB(self.serviceName, _media_id, data);
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
		
	}
	uploadCover(_file:File,
			    _media_id:number,
			    _progress:any = null) {
	    const formData = new FormData();
	    formData.append('file_name', _file.name);
    	formData.append('type_id', _media_id.toString());
	    formData.append('file', _file);
	    let self = this;
		return new Promise((resolve, reject) => {
			self.http.uploadMultipart(this.serviceName + "/" + _media_id + "/add_cover/", formData, _progress)
				.then(function(response) {
					let data = response;
					if (data === null || data === undefined) {
						reject("error retrive data from server");
						return;
					}
					self.bdd.asyncSetInDB(self.serviceName, _media_id, data);
					resolve(data);
				}).catch(function(response) {
					reject(response);
				});
		});
	}
	uploadCoverBlob(_blob:Blob,
		    _media_id:number,
		    _progress:any = null) {
    const formData = new FormData();
    formData.append('file_name', "take_screenshoot");
	formData.append('type_id', _media_id.toString());
    formData.append('file', _blob);
    let self = this;
	return new Promise((resolve, reject) => {
		self.http.uploadMultipart(this.serviceName + "/" + _media_id + "/add_cover/", formData, _progress)
			.then(function(response) {
				let data = response;
				if (data === null || data === undefined) {
					reject("error retrive data from server");
					return;
				}
				self.bdd.asyncSetInDB(self.serviceName, _media_id, data);
				resolve(data);
			}).catch(function(response) {
				reject(response);
			});
	});
}
}

