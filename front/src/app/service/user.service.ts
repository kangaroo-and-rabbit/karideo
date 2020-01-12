import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';
//import { SHA512 } from 'assets/js_3rd_party/sha512';

interface MessageLogIn {
	login: string;
	methode: string;
	time: number;
	password: string;
};

interface MessageAnswer_USER_CONNECT {
	sessionId: string,
	login: string,
	eMail: string,
	role: string,
	avatar: string
};

declare function SHA512(param1: any): any;
declare function dateFormat(param1: any, param2: any): any;

@Injectable()
export class UserService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	
	constructor(private http: HttpWrapperService) {
		console.log("Start UserService");
	}
	
	login(_login: string, _password: string):any {
		return this.loginSha(_login, SHA512(_password));
	}
	
	loginSha(_login : string, _password : string) {
		console.log("AuthService.login ... '" + _login + "':'" + _password + "'");
		let currentDate:number = dateFormat(new Date(), 'm-d-Y h:i:s ms');
		let data:MessageLogIn;
		// create request:
		if (this.identificationVersion == 0) {
			data = {
			    login: _login,
			    methode: "v0",
			    time: currentDate,
			    password: _password
			    };
		} else if (this.identificationVersion == 1) {
			data = {
			    login: _login,
			    methode: "v1",
			    time: currentDate,
			    // we mix the password to be sure that it can not be used an other time ...
			    password: SHA512("login='" + _login + "';pass='" + _password + "';date='" + currentDate + "'")
			    };
		}
		
		const httpOption = { 'Content-Type': 'application/json' };
		console.log("call users/connect data=" + JSON.stringify(data, null, 2));
		
		return new Promise((resolve, reject) => {
			this.http.post("rest-auth/login", httpOption, data)
				.then(function(response: any) {
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
	
	create(_login : string, _email : string, _password : string) {
		return this.createSha(_login, _email, SHA512(_password));
	}
	createSha(_login : string, _email : string, _password : string, ) {
		let data = {
			"methode": "v?",
			"login": _login,
			"email": _email,
			"password": _password
		}
		const httpOption = { 'Content-Type': 'application/json' };
		console.log("call users data=" + JSON.stringify(data, null, 2));
		
		if (this.identificationVersion == 0) {
			data["methode"] = "v0"
		} else if (this.identificationVersion == 1) {
			data["methode"] = "v1"
		}
		
		return new Promise((resolve, reject) => {
			this.http.post("users", httpOption, data)
				.then(function(response: any) {
					if (response.status == 200) {
						resolve(response.data)
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
	
	isAuthenticated():boolean {
		//return !!Session.userId;
		return false;
	};
	isAuthorized(_authorizedRoles: string): boolean {
		/*
		if (!angular.isArray(_authorizedRoles)) {
			authorizedRoles = [_authorizedRoles];
		}
		return (    authService.isAuthenticated()
		         && _authorizedRoles.indexOf(Session.userRole) !== -1
		       );
		*/
		return false;
	};
	
	checkLogin(_login: string) {
		let params = {
			login: _login
		};
		return new Promise((resolve, reject) => {
			this.http.get("users/check_login", {}, params).then(
				(res: Response) => {
					resolve()
				},
				error => {
					reject(error.status);
				});
			});
	}
	
	checkEMail(_email: string) {
		let params = {
			"email": _email
		};
		return new Promise((resolve, reject) => {
			this.http.get("users/check_email", {}, params).then(
				(res: Response) => {
					resolve()
				},
				error => {
					reject(error.status);
				});
			});
	}
}

