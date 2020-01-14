import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';

@Injectable()
export class VideoService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	
	constructor(private http: HttpWrapperService) {
		console.log("Start VideoService");
	}
	
	get(_id:number):any {
		return this.http.get_specific("video", _id);
	};
	put(_id:number, _data:any):any {
		return this.http.put_specific("video", _id, _data);
	};
}

