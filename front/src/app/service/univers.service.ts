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
		console.log("Get All data from types");
		const httpOption = { 'Content-Type': 'application/json' };
		let url = "univers";
		console.log("call GET " + url);
		
		return new Promise((resolve, reject) => {
			this.http.get(url, httpOption, {})
				.then(function(response: any) {
					if (response.status == 200) {
						resolve(response.data);
						//console.log("get data from univers : " + response.data);
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
		console.log("Get All data from univers");
		const httpOption = { 'Content-Type': 'application/json' };
		let url = "univers/" + _id;
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
	
	getSubGroup(_id: number):any {
		console.log("Get All data from types");
		const httpOption = { 'Content-Type': 'application/json' };
		let url = "univers/" + _id + "/group";
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
	
	getSubVideo(_id: number):any {
		console.log("Get All data from types");
		const httpOption = { 'Content-Type': 'application/json' };
		let url = "univers/" + _id + "/video_no_group";
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

