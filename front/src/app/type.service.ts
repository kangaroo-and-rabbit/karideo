import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/http-wrapper.service';
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
		console.log("Get All data from types");
		let currentDate:number = dateFormat(new Date(), 'm-d-Y h:i:s ms');
		const httpOption = { 'Content-Type': 'application/json' };
		let url = "type";
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
	
	get(_id:number):any {
		console.log("Get All data from types");
		let currentDate:number = dateFormat(new Date(), 'm-d-Y h:i:s ms');
		const httpOption = { 'Content-Type': 'application/json' };
		let url = "type/" + _id;
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
		let currentDate:number = dateFormat(new Date(), 'm-d-Y h:i:s ms');
		const httpOption = { 'Content-Type': 'application/json' };
		let url = "type/" + _id + "/group";
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
	
	getSubVideoNoGroup(_id: number):any {
		console.log("Get All data from types");
		let currentDate:number = dateFormat(new Date(), 'm-d-Y h:i:s ms');
		const httpOption = { 'Content-Type': 'application/json' };
		let url = "type/" + _id + "/video_no_group";
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

