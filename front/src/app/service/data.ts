import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper';
import { DataInterface } from 'app/service/dataInterface';

import { environment } from 'environments/environment';

@Injectable()
export class DataService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	private bdd: DataInterface = null;
	private serviceName:string = "data";
	
	constructor(private http: HttpWrapperService) {
		console.log("Start TypeService");
	}
	
	getData():any {
		return this.http.get_specific(this.serviceName);
	};
	
	get(_id:number):any {
		return this.http.get_specific(this.serviceName, _id);
	};
	
	sendFile(_file:File) {
		//return this.http.uploadFileMultipart(this.serviceName, null, _file);
		return this.http.uploadFileBase64(this.serviceName, null, _file);
	}
}

