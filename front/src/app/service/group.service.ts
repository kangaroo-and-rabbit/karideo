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
	
	getVideoAll(_id:number):any {
		return this.http.get_specific("group", _id, "video_all");
	};
	
	getVideo(_id:number):any {
		return this.http.get_specific("group", _id, "video");
	};
	
	getSaison(_id:number, _select:Array<string> = []):any {
		return this.http.get_specific("group", _id, "saison", _select);
	};
}

