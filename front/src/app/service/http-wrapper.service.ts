import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from 'environments/environment';

@Injectable()
export class HttpWrapperService {
	private displayReturn:boolean = false;
	constructor(private http: HttpClient) {
		
	}
	
	createRESTCall(_api:string, _options:any = undefined) {
		let basePage = environment.apiUrl;
		let addressServerRest = basePage + "/";
		let out;
		if (typeof _options === 'undefined') {
			_options = [];
		}
		out = addressServerRest + _api;
		let first = true;
		for (let iii=0; iii<_options.length; iii++) {
			if (first ==false) {
				out += "&";
			} else {
				out += "?";
				first = false;
			}
			out += _options[iii];
		}
		return out;
	}
	
	get(_uriRest:string, _headerOption:any, _params:any) {
		let connectionAdresse = this.createRESTCall(_uriRest, {});
		let config = {
			params: _params,
			headers: new HttpHeaders(_headerOption)
		};
		return new Promise((resolve, reject) => {
			if (this.displayReturn == true) {
				console.log("call GET " + connectionAdresse + " params=" + JSON.stringify(_params, null, 2));
			}
			let request = this.http.get<any>(connectionAdresse, config);
			let self = this;
			request.subscribe((res: any) => {
					if (self.displayReturn == true) {
						console.log("!! data " + JSON.stringify(res, null, 2));
					}
					if (res) {
						if (res.httpCode) {
							resolve({status:res.httpCode, data:res});
						} else {
							resolve({status:200, data:res});
						}
					} else {
						resolve({status:200, data:""});
					}
				},
				error => {
					if (self.displayReturn == true) {
						console.log("an error occured status: " + error.status);
						console.log("answer: " + JSON.stringify(error, null, 2));
					}
					reject({status:error.status, data:error.error});
				});
			});
	}
	
	post(_uriRest:string, _headerOption:any, _data:any) {
		let connectionAdresse = this.createRESTCall(_uriRest, {});
		const httpOption = {
			headers: new HttpHeaders(_headerOption)
		};
		return new Promise((resolve, reject) => {
			if (this.displayReturn == true) {
				console.log("call POST " + connectionAdresse + " data=" + JSON.stringify(_data, null, 2));
			}
			let request = this.http.post<any>(connectionAdresse, _data, httpOption);
			let self = this;
			request.subscribe((res: any) => {
					if (self.displayReturn == true) {
						console.log("!! data " + JSON.stringify(res, null, 2));
					}
					if (res) {
						if (res.httpCode) {
							resolve({status:res.httpCode, data:res});
						} else {
							resolve({status:200, data:res});
						}
					} else {
						resolve({status:200, data:""});
					}
				},
				error => {
					if (self.displayReturn == true) {
						console.log("an error occured status: " + error.status);
						console.log("answer: " + JSON.stringify(error, null, 2));
					}
					reject({status:error.status, data:error.error});
				});
			});
	}
}
