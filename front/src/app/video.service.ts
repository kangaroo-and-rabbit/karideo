import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/http-wrapper.service';

@Injectable()
export class VideoService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	
	constructor(private http: HttpWrapperService) {
		console.log("Start VideoService");
	}
	
	get(_id:number):any {
		const httpOption = { 'Content-Type': 'application/json' };
		let url = "video/" + _id;
		console.log("call GET " + url);
		
		return new Promise((resolve, reject) => {
			this.http.get(url, httpOption, {})
				.then(function(response: any) {
					if (response.status == 200) {
						resolve(response.data);
						console.log("get data from type : " + response.data);
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
}

