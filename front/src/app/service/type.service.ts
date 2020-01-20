import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';
//import { SHA512 } from 'assets/js_3rd_party/sha512';

export interface MessageLogIn {
	id: number;
	name: string;
	description: string;
};

declare function SHA512(param1: any): any;
declare function dateFormat(param1: any, param2: any): any;

@Injectable()
export class TypeService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	
	constructor(private http: HttpWrapperService) {
		console.log("Start TypeService");
	}
	
	
	getData():any {
		return this.http.get_specific("type");
	};
	
	get(_id:number):any {
		return this.http.get_specific("type", _id);
	};
	
	getSubGroup(_id:number, _select:Array<string> = []):any {
		return this.http.get_specific("type", _id, "group", _select);
	};
	
	getSubVideo(_id:number, _select:Array<string> = []):any {
		return this.http.get_specific("type", _id, "video", _select);
	};
	
	getSubUnivers(_id:number, _select:Array<string> = []):any {
		return this.http.get_specific("type", _id, "univers", _select);
	};
	
	getCoverUrl(_coverId:number):any {
		return this.http.createRESTCall("data/" + _coverId);
	};
}

