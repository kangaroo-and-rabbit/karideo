import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent, HttpEventType} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {Observable} from "rxjs";

import { environment } from 'environments/environment';
import { SessionService } from 'app/service/session';

@Injectable()
export class HttpWrapperService {
	private displayReturn:boolean = false;
	constructor(private http: HttpClient,
				private session: SessionService) {
		
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
	
	addTokenIfNeeded(_headerOption:any): any {
		if (this.session.sessionData != null) {
			if (_headerOption.authorization === undefined) {
				_headerOption["authorization"] = "Yota " + this.session.sessionData.userId + ":" + this.session.sessionData.token;
			}
		}
		return _headerOption;
	}
	
	get(_uriRest:string, _headerOption:any, _params:any) {
		this.addTokenIfNeeded(_headerOption);
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
	
	post(_uriRest:string, _headerOption:any, _data:any, _progress:any = null) {
		this.addTokenIfNeeded(_headerOption);
		let connectionAdresse = this.createRESTCall(_uriRest, {});
		

		return new Promise((resolve, reject) => {
			if (this.displayReturn == true) {
				console.log("call POST " + connectionAdresse + " data=" + JSON.stringify(_data, null, 2));
			}
			let request = this.http.post(connectionAdresse, _data, {  
				  headers: new HttpHeaders(_headerOption),
			      reportProgress: true,  
			      observe: 'events'  
			    });
			let self = this;
			request.subscribe((res: any) => {
					if (self.displayReturn == true) {
						console.log("!! data " + JSON.stringify(res, null, 2));
					}
			        if (res.type === HttpEventType.Sent) {
			        	/* res.type == 0 */
			        	console.log("post : Sent");
			        } else if (res.type === HttpEventType.UploadProgress) {
			        	/* res.type == 1 */
			            //console.log("post : " + res.loaded + " / " +  res.total);
			            _progress(res.loaded, res.total);
			        } else if (res.type === HttpEventType.ResponseHeader) {
			        	/* res.type == 2 */
			        	console.log("post : get header");
			        } else if (res.type === HttpEventType.DownloadProgress) {
			        	/* res.type == 3 */
			        	console.log("post : get DownloadProgress " + res.loaded);
			        } else if (res.type === HttpEventType.Response) {
			        	/* res.type == 4 */
			        	console.log("post : get response");
			        	if (res.httpCode) {
							resolve({status:res.httpCode, data:res});
						} else {
							resolve({status:200, data:res});
						}
			        } else if (res.type === HttpEventType.User) {
			        	/* res.type == 5 */
			        	console.log("post : get User");
			        } else {
			        	console.log("post : get unknown ... " + res.type);
			        }
				},
				error => {
					if (self.displayReturn == true) {
						console.log("an error occured status: " + error.status);
						console.log("answer: " + JSON.stringify(error, null, 2));
					}
					reject({status:error.status, data:error.error});
				});
			/*

			      switch (event.type) {

			        case HttpEventType.UploadProgress:
			          const progress = Math.round(100 * event.loaded / event.total);
			          return { status: 'progress', message: progress };

			        case HttpEventType.Response:
			          return event.body;
			        default:
			          return `Unhandled event: ${event.type}`;
			      }
			    })
			    );
			    */
			});
	}
	put(_uriRest:string, _headerOption:any, _data:any) {
		this.addTokenIfNeeded(_headerOption);
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
	delete(_uriRest:string, _headerOption:any) {
		this.addTokenIfNeeded(_headerOption);
		let connectionAdresse = this.createRESTCall(_uriRest, {});
		const httpOption = {
			headers: new HttpHeaders(_headerOption)
		};
		return new Promise((resolve, reject) => {
			if (this.displayReturn == true) {
				console.log("call POST " + connectionAdresse);
			}
			let request = this.http.delete<any>(connectionAdresse, httpOption);
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
	
	uploadFileMultipart(_base:string, _id:number, _file:File): any {
		console.log("Upload file to " + _base);
		
		let url = _base;
		if (_id != null) {
			url += "/" + _id;
		}
		let formData = new FormData();
		formData.append('upload', _file);
		let headers = new Headers();
		console.log("upload filename : " + _file.name);
		let extention = _file.name.split('.').pop();
		if (extention == "jpg") {
			headers.append('Content-Type', "image/jpeg");
		} else if (extention == "png") {
			headers.append('Content-Type', "image/png");
		} else if (extention == "mkv") {
			headers.append('Content-Type', "video/x-matroska");
		} else if (extention == "webm") {
			headers.append('Content-Type', "video/webm");
		} else {
			return null;
		}
		headers.append('filename', _file.name);
		
		const httpOption = {
			headers: headers,
			reportProgress: true,
		};
		return new Promise((resolve, reject) => {
			this.post(url, httpOption, formData)
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
	}
	uploadFileBase64(_base:string, _id:number, _file:File): any {
		console.log("Upload file to " + _base);
		
		let url = _base;
		if (_id != null) {
			url += "/" + _id;
		}
		let self = this;
		let reader = new FileReader();
		reader.readAsArrayBuffer(_file);
		return new Promise((resolve, reject) => {
			reader.onload = () => {
				let headers = {};//new Headers();
				console.log("upload filename : " + _file.name);
				let extention = _file.name.split('.').pop();
				if (extention == "jpg") {
					//headers.append('Content-Type', "image/jpeg");
					headers['Content-Type'] = "image/jpeg";
					headers['mime-type'] = "image/jpeg";
				} else if (extention == "jpeg") {
					//headers.append('Content-Type', "image/jpeg");
					headers['Content-Type'] = "image/jpeg";
					headers['mime-type'] = "image/jpeg";
				} else if (extention == "webp") {
					//headers.append('Content-Type', "image/webp");
					headers['Content-Type'] = "image/webp";
					headers['mime-type'] = "image/webp";
				} else if (extention == "png") {
					//headers.append('Content-Type', "image/png");
					headers['Content-Type'] = "image/png";
					headers['mime-type'] = "image/png";
				} else if (extention == "mkv") {
					headers['Content-Type'] = "video/x-matroska";
					headers['mime-type'] = "video/x-matroska";
				} else if (extention == "webm") {
					headers['Content-Type'] = "video/webm";
					headers['mime-type'] = "video/webm";
				} else {
					return null;
				}
				//headers.append('filename', _file.name);
				headers['filename'] = _file.name;
				
				self.post(url, headers, reader.result)
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
							reject("return ERROR ...");// + JSON.stringify(response, null, 2));
						}
					});
			};
		});
	}
	uploadFile(_base:string, _file:File): any {
		console.log("Upload file to " + _base);
		
		let url = _base;
		let self = this;
		let reader = new FileReader();
		reader.readAsArrayBuffer(_file);
		return new Promise((resolve, reject) => {
			reader.onload = () => {
				let headers = {};//new Headers();
				console.log("upload filename : " + _file.name);
				let extention = _file.name.split('.').pop();
				if (extention == "jpg") {
					//headers.append('Content-Type', "image/jpeg");
					headers['Content-Type'] = "image/jpeg";
					headers['mime-type'] = "image/jpeg";
				} else if (extention == "jpeg") {
					//headers.append('Content-Type', "image/jpeg");
					headers['Content-Type'] = "image/jpeg";
					headers['mime-type'] = "image/jpeg";
				} else if (extention == "webp") {
					//headers.append('Content-Type', "image/webp");
					headers['Content-Type'] = "image/webp";
					headers['mime-type'] = "image/webp";
				} else if (extention == "png") {
					//headers.append('Content-Type', "image/png");
					headers['Content-Type'] = "image/png";
					headers['mime-type'] = "image/png";
				} else if (extention == "mkv") {
					headers['Content-Type'] = "video/x-matroska";
					headers['mime-type'] = "video/x-matroska";
				} else if (extention == "webm") {
					headers['Content-Type'] = "video/webm";
					headers['mime-type'] = "video/webm";
				} else {
					return null;
				}
				//headers.append('filename', _file.name);
				headers['filename'] = _file.name;
				
				self.post(url, headers, reader.result)
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
							reject("return ERROR ...");// + JSON.stringify(response, null, 2));
						}
					});
			};
		});
	}
	uploadMultipart(_base:string, _multipart:FormData, _progress:any): any {
		console.log("Upload multipart to " + _base);
		
		let url = _base;
		let self = this;
		return new Promise((resolve, reject) => {
			let headers = {
					//'Content-Type': 'multipart/form-data',
					};//new Headers();
			
			self.post(url, headers, _multipart, _progress)
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
						reject("return ERROR ...");// + JSON.stringify(response, null, 2));
					}
				});
		});
	}
	/*
	public upload(_base:string, _id:number, _file:File): any {
		data, userId) {
	}
	    let uploadURL = `${this.SERVER_URL}/auth/${userId}/avatar`;

	    return this.http.post<any>(uploadURL, data, {
	      reportProgress: true,
	      observe: 'events'
	    }).pipe(map((event) => {

	      switch (event.type) {

	        case HttpEventType.UploadProgress:
	          const progress = Math.round(100 * event.loaded / event.total);
	          return { status: 'progress', message: progress };

	        case HttpEventType.Response:
	          return event.body;
	        default:
	          return `Unhandled event: ${event.type}`;
	      }
	    })
	    );
	  }
	*/
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
		//console.log("call GET " + url);
		
		return new Promise((resolve, reject) => {
			this.get(url, httpOption, {})
				.then(function(response: any) {
					//console.log("URL: " + url + "\nRespond(" + response.status + "): " + JSON.stringify(response.data, null, 2));
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
	delete_specific(_base:string, _id:number, _subElement:string = ""):any {
		//console.log("delete data to " + _base);
		const httpOption = { 'Content-Type': 'application/json' };
		let url = _base;
		if (_id != null) {
			url += "/" + _id;
		}
		if (_subElement != "") {
			url += "/" + _subElement;
		}
		//console.log("call DELETE: " + url);
		//console.log("    data: " + JSON.stringify(_data, null, 2));
		
		return new Promise((resolve, reject) => {
			this.delete(url, httpOption)
				.then(function(response: any) {
					//console.log("URL: " + url + "\nRespond(" + response.status + "): " + JSON.stringify(response.data, null, 2));
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
	// Complex wrapper to simplify interaction:
	put_specific(_base:string, _id:number, _data:any, _subElement:string = ""):any {
		//console.log("put data to " + _base);
		const httpOption = { 'Content-Type': 'application/json' };
		let url = _base;
		if (_id != null) {
			url += "/" + _id;
		}
		if (_subElement != "") {
			url += "/" + _subElement;
		}
		//console.log("call PUT: " + url);
		//console.log("    data: " + JSON.stringify(_data, null, 2));
		
		return new Promise((resolve, reject) => {
			this.put(url, httpOption, _data)
				.then(function(response: any) {
					//console.log("URL: " + url + "\nRespond(" + response.status + "): " + JSON.stringify(response.data, null, 2));
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
	// Complex wrapper to simplify interaction:
	post_specific(_base:string, _id:number, _data:any, _subElement:string = ""):any {
		//console.log("put data to " + _base);
		const httpOption = { 'Content-Type': 'application/json' };
		let url = _base;
		if (_id != null) {
			url += "/" + _id;
		}
		if (_subElement != "") {
			url += "/" + _subElement;
		}
		//console.log("call PUT: " + url);
		//console.log("    data: " + JSON.stringify(_data, null, 2));
		
		return new Promise((resolve, reject) => {
			this.post(url, httpOption, _data)
				.then(function(response: any) {
					//console.log("URL: " + url + "\nRespond(" + response.status + "): " + JSON.stringify(response.data, null, 2));
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
