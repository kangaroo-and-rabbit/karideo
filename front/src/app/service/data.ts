import { Injectable } from '@angular/core';
import { HttpWrapperService } from './http-wrapper';
import { DataInterface } from './dataInterface';


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
	}
	
	get(_id:number):any {
		return this.http.get_specific(this.serviceName, _id);
	}
	
	sendFile(_file:File) {
		//return this.http.uploadFileMultipart(this.serviceName, null, _file);
		return this.http.uploadFileBase64(this.serviceName, null, _file);
	}
	
	uploadFile(_form:FormData, _progress:any = null) {
		//return this.http.uploadFileMultipart(this.serviceName, null, _file);
		return this.http.uploadMultipart(this.serviceName + "/upload/", _form, _progress);
	}
}

