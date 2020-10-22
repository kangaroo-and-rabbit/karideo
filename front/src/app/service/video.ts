import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper';
import { DataInterface } from 'app/service/dataInterface';
import { BddService } from 'app/service/bdd';

import { environment } from 'environments/environment';

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
	addCover(_id:number, _coverId:number):any {
		return this.http.post_specific(this.serviceName, _id, {"data_id":_coverId}, "add_cover");
	}
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	}
	getCoverThumbnailUrl(_coverId:number):any {
		return this.http.createRESTCall("data/thumbnail/" + _coverId);
	}
	
	uploadFile(_file:File,
			   _universe:string,
			   _serie:string,
			   _saison:number,
			   _episode:number,
			   _title:string,
			   _type_id:number,
			   _progress:any = null) {
	    const formData = new FormData();
	    formData.append('file_name', _file.name);
	    formData.append('universe', _universe);
	    formData.append('serie', _serie);
	    if (_saison != null) {
	    	formData.append('saison', _saison.toString());
	    } else {
	    	formData.append('saison', null);
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
}

