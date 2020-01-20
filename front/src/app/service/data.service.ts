import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';

@Injectable()
export class DataService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	
	constructor(private http: HttpWrapperService) {
		console.log("Start TypeService");
	}
	
	getData():any {
		return this.http.get_specific("data");
	};
	
	get(_id:number):any {
		return this.http.get_specific("data", _id);
	};
	
	sendFile(_file:File) {
		//return this.http.uploadFileMultipart("data", null, _file);
		return this.http.uploadFileBase64("data", null, _file);
	}
}

