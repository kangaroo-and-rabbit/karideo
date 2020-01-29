import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';

@Injectable()
export class GroupService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	
	constructor(private http: HttpWrapperService) {
		console.log("Start GroupService");
	}
	
	get(_id:number):any {
		return this.http.get_specific("group", _id);
	};
	getOrder():any {
		return this.http.get_specific("group", null, "", ["name","id"]);
	};
	
	getVideoAll(_id:number):any {
		return this.http.get_specific("group", _id, "video_all");
	};
	
	getVideo(_id:number):any {
		return this.http.get_specific("group", _id, "video");
	};
	
	getSaison(_id:number, _select:Array<string> = []):any {
		return this.http.get_specific("group", _id, "saison", _select);
	};
	
	put(_id:number, _data:any):any {
		return this.http.put_specific("group", _id, _data);
	};
	addCover(_id:number, _coverId:number):any {
		return this.http.post_specific("group", _id, {"data_id":_coverId}, "add_cover");
	};
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	};
}

