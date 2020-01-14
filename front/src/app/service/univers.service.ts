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
	
}

