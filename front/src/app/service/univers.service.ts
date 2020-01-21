import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';

@Injectable()
export class UniversService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	
	constructor(private http: HttpWrapperService) {
		console.log("Start universService");
	}
	
	getData():any {
		return this.http.get_specific("univers");
	};
	
	get(_id:number):any {
		return this.http.get_specific("univers", _id);
	};
	
	getSubGroup(_id:number, _select:Array<string> = []):any {
		return this.http.get_specific("univers", _id, "group", _select);
	};
	
	getSubVideo(_id:number, _select:Array<string> = []):any {
		return this.http.get_specific("univers", _id, "video", _select);
	};
	
	put(_id:number, _data:any):any {
		return this.http.put_specific("univers", _id, _data);
	};
	addCover(_id:number, _coverId:number):any {
		return this.http.post_specific("univers", _id, {"data_id":_coverId}, "add_cover");
	};
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	};
}

