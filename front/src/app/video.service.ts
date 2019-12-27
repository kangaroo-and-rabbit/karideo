import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/http-wrapper.service';

@Injectable()
export class VideoService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	
	constructor(private http: HttpWrapperService) {
		console.log("Start VideoService");
	}
	
	get_specific(_id:number, _subElement:string = ""):any {
		console.log("Get All data from types");
		const httpOption = { 'Content-Type': 'application/json' };
		let url = "video/" + _id;
		if (_subElement != "") {
			url += "/" + _subElement;
		}
		console.log("call GET " + url);
		
		return new Promise((resolve, reject) => {
			this.http.get(url, httpOption, {})
				.then(function(response: any) {
					if (response.status == 200) {
						resolve(response.data);
						console.log("get data from response : " + JSON.stringify(response.data, null, 2));
						return;
					}
					reject("An error occured");
				}, function(response: any) {
					if (typeof response.data === 'undefined') {
						reject("return ERROR undefined");
					} else {
						reject("return ERROR " + JSON.stringify(response.data, null, 2));
					}
				});
		});
	};
	get(_id:number):any {
		return this.get_specific(_id);
	};
}

