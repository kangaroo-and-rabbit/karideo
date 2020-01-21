import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';

@Injectable()
export class SaisonService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	
	constructor(private http: HttpWrapperService) {
		console.log("Start SaisonService");
	}
	
	get(_id:number):any {
		return this.http.get_specific("saison", _id);
	};
	getVideo(_id:number):any {
		return this.http.get_specific("saison", _id, "video");
	};
	put(_id:number, _data:any):any {
		return this.http.put_specific("saison", _id, _data);
	};
	addCover(_id:number, _coverId:number):any {
		return this.http.post_specific("saison", _id, {"data_id":_coverId}, "add_cover");
	};
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	};
}

