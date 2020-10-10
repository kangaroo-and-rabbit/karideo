/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';
import { slideInOutAnimation } from '../../_animations/index';
import { UserService } from '../../service/user';
import { SessionService } from '../../service/session';
import { CookiesService } from '../../service/cookies';
import { ArianeService } from '../../service/ariane';


export let checkLoginValidity = function(_value:string):boolean {
	let regexCheck = new RegExp("^[a-zA-Z0-9_\.-]+$");
	if (regexCheck.test(_value)) {
		return true;
	}
	return false;
};

export let checkEmailValidity = function(_value:string):boolean {
	let regexCheck = new RegExp("^[a-zA-Z0-9_\.@-]+@[a-zA-Z0-9_\.-]+\\.[a-zA-Z]+$");
	if (regexCheck.test(_value)) {
		return true;
	}
	return false;
};

export let checkPasswordValidity = function(_value:string):boolean {
	let regexCheck = new RegExp("^[a-zA-Z0-9_\.@ %:;,=}{\?\!\*\+\(\)\[\]\|&#%~/\\\<\>-£€]+$");
	if (regexCheck.test(_value)) {
		return true;
	}
	return false;
};


declare function SHA512(param1: any): any;

@Component({
	selector: 'app-login',
	templateUrl: './login.html',
	styleUrls: ['./login.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class LoginComponent implements OnInit {
	public loginOK:boolean = false;
	public loginHelp:string = "";
	public login:string = "";
	public passOK:boolean = false;
	public passHelp:string = "";
	public password:string = "";
	public loginButtonDisabled:boolean = true;
	public error:string = "";
	public loginType:string = "Username/E-mail";
	
	public rememberMe:boolean = true;
	
	constructor(private router: Router,
	            private route: ActivatedRoute,
	            private locate: Location,
	            private cookiesService: CookiesService,
	            private userService: UserService,
	            private sessionService: SessionService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		// TODO : If already loaded ==> jusp in the home page ...
		this.arianeService.updateManual(this.route.snapshot.paramMap);
	}
	
	updateButtonVisibility():void {
		if (    this.loginOK == true
		     && this.passOK == true) {
			this.loginButtonDisabled = false;
		} else {
			this.loginButtonDisabled = true;
		}
		this.error = "";
	}
	/**
	 * Check the login writing rules
	 */
	checkLogin(_newValue:string):void {
		this.login = _newValue;
		if (this.login == null) {
			this.loginOK = false;
			this.loginHelp = "";
			this.updateButtonVisibility();
			return;
		}
		if (this.login.length < 6) {
			this.loginOK = false;
			this.loginHelp = "Need 6 characters";
			this.loginType = "Username/E-mail";
			this.updateButtonVisibility();
			return;
		}
		if (checkLoginValidity(this.login) == true) {
			this.loginOK = true;
			this.loginHelp = "";
			this.loginType = "Username";
		} else {
			if (checkEmailValidity(this.login) == true) {
				this.loginOK = true;
				this.loginHelp = "";
				this.loginType = "E-mail";
			} else {
				this.loginOK = false;
				this.loginHelp = 'Not valid: characters, numbers, "_-." and email format: you@example.com';
			}
		}
		this.updateButtonVisibility();
	}
	
	/**
	 * Check the password writing rules
	 */
	checkPassword(_newValue:string):void {
		this.password = _newValue;
		if (this.password == null) {
			this.passOK = false;
			this.passHelp = "";
			this.updateButtonVisibility();
			return;
		}
		if (this.password.length < 6) {
			this.passOK = false;
			this.passHelp = "Need 6 characters";
		} else {
			if (checkPasswordValidity(this.password) == true) {
				this.passOK = true;
				this.passHelp = "";
			} else {
				this.passOK = false;
				this.passHelp = 'Not valid: characters, numbers and "_-:;.,?!*+=}{([|)]% @&~#/\<>"';
			}
		}
		this.updateButtonVisibility();
	}
	onLogin():void {
		this.sessionService.destroy();
		let self = this
		this.userService.login(this.login, this.password)
			.then(function(response) {
				self.error = "Login ...";
				self.sessionService.create(response['sessionId'],
				                           response['login'],
				                           response['email'],
				                           response['role'],
				                           response['avatar']);
				if (self.rememberMe == true) {
					self.cookiesService.set("yota-login", response['login'], 120);
					self.cookiesService.set("yota-password", SHA512(self.password), 60);
				}
				self.router.navigate(['home']);
			}).catch(function(response) {
				self.error = "Wrong e-mail/login or password";
			});
	}
	onCancel():void {
		console.log("onCancel ... '" + this.login + "':'" + this.password + "'");
		this.locate.back();
	}
}


