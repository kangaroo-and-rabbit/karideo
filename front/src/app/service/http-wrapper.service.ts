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
	put(_uriRest:string, _headerOption:any, _data:any) {
		let connectionAdresse = this.createRESTCall(_uriRest, {});
		const httpOption = {
			headers: new HttpHeaders(_headerOption)
		};
		return new Promise((resolve, reject) => {
			if (this.displayReturn == true) {
				console.log("call POST " + connectionAdresse + " data=" + JSON.stringify(_data, null, 2));
			}
			let request = this.http.put<any>(connectionAdresse, _data, httpOption);
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
	
	// Complex wrapper to simplify interaction:
	get_specific(_base:string, _id:number = null, _subElement:string = "", _select:Array<string> = []):any {
		console.log("Get All data from " + _base);
		const httpOption = { 'Content-Type': 'application/json' };
		let url = _base;
		if (_id != null) {
			url += "/" + _id;
		}
		if (_subElement != "") {
			url += "/" + _subElement;
		}
		if (_select.length != 0) {
			let select = ""
			for (let iii=0; iii<_select.length; iii++) {
				if (select.length != 0) {
					select += "&";
				}
				select += "select=" + _select[iii];
			}
			url += "?" + select;
		}
		console.log("call GET " + url);
		
		return new Promise((resolve, reject) => {
			this.get(url, httpOption, {})
				.then(function(response: any) {
					console.log("URL: " + url + "\nRespond(" + response.status + "): " + JSON.stringify(response.data, null, 2));
					if (response.status == 200) {
						resolve(response.data);
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
	
	// Complex wrapper to simplify interaction:
	put_specific(_base:string, _id:number, _data:any, _subElement:string = ""):any {
		console.log("put data to " + _base);
		const httpOption = { 'Content-Type': 'application/json' };
		let url = _base;
		if (_id != null) {
			url += "/" + _id;
		}
		if (_subElement != "") {
			url += "/" + _subElement;
		}
		console.log("call PUT: " + url);
		console.log("    data: " + JSON.stringify(_data, null, 2));
		
		return new Promise((resolve, reject) => {
			this.put(url, httpOption, _data)
				.then(function(response: any) {
					console.log("URL: " + url + "\nRespond(" + response.status + "): " + JSON.stringify(response.data, null, 2));
					if (response.status == 200) {
						resolve(response.data);
						return;
					}
					if (response.status == 201) {
						resolve(response.data);
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
