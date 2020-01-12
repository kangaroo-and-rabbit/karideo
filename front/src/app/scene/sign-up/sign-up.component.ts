/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { checkLoginValidity, checkEmailValidity, checkPasswordValidity } from '../login/login.component';
import { fadeInAnimation } from '../../_animations/index';
import { UserService } from '../../service/user.service';


@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class SignUpComponent implements OnInit {

	private signUp_iconWrong:string = "icon-right-not-validate";
	private signUp_iconWait:string = "icon-right-load";
	private signUp_iconRight:string = "icon-right-validate";

	public login:string = "";
	public loginOK:boolean = false;
	public loginHelp:string = "";
	public loginIcon:string = "";
	
	public email:string = "";
	public emailOK:boolean = false;
	public emailHelp:string = "";
	public emailIcon:string = "";
	
	public password:string = "";
	public passOK:boolean = false;
	public passHelp:string = "";
	public passIcon:string = "";
	
	public signUpButtonDisabled:boolean = true;
	public error:string = "";
	
	public rememberMe:boolean = true;
	
	
	constructor(private userService: UserService,
	            private router: Router) {
		
	}
	
	ngOnInit() {
		
	}
	
	updateButtonVisibility():void {
		if (    this.loginOK == true
		     && this.passOK == true
		     && this.emailOK == true) {
			this.signUpButtonDisabled = false;
		} else {
			this.signUpButtonDisabled = true;
		}
		this.error = "";
	}
	checkLogin(_newValue:string):void {
		//this.userService.loginSha("loooogin", "ekljkj", true);
		this.login = _newValue;
		if (    this.login == null
		     || this.login.length == 0) {
			this.loginOK = false;
			this.loginIcon = "";
			this.loginHelp = "";
			this.updateButtonVisibility();
			return;
		}
		if (this.login.length < 6) {
			this.loginOK = false;
			this.loginHelp = "Need 6 characters";
			this.loginIcon = "";
			this.updateButtonVisibility();
			return;
		}
		if (checkLoginValidity(this.login) == true) {
			this.loginOK = false;
			//this.loginHelp = "check in progress...";
			this.loginIcon = this.signUp_iconWait;
			let self = this;
			this.userService.checkLogin(this.login).then(function() {
					// check if the answer is correct with the question
					if (_newValue != self.login) {
						return;
					}
					// the login exist ... ==> it is found...
					self.loginOK = false;
					self.loginHelp = "Login already used ...";
					self.loginIcon = self.signUp_iconWrong;
					self.updateButtonVisibility();
				}, function(error: number) {
					console.log("1 " + self);
					// check if the answer is correct with the question
					if (_newValue != self.login) {
						return;
					}
					if (error == 404) {
						self.loginOK = true;
						self.loginHelp = "";
						self.loginIcon = self.signUp_iconRight;
						self.updateButtonVisibility();
						return;
					}
					console.log("Status " + error);
					self.loginOK = false;
					self.loginHelp = "Login already used ...";
					self.loginIcon = self.signUp_iconWrong;
					self.updateButtonVisibility();
				});
		} else {
			this.loginOK = false;
			this.loginHelp = 'Not valid: characters, numbers and "_-."';
		}
		this.updateButtonVisibility();
	}
	
	checkEmail(_newValue:string):void {
		this.email = _newValue
		if (    this.email == null
		     || this.email.length == 0) {
			this.emailOK = false;
			this.updateButtonVisibility();
			this.emailIcon = "";
			this.emailHelp = "";
			return;
		}
		if (this.email.length < 6) {
			this.emailOK = false;
			this.emailHelp = "Need 6 characters";
			this.updateButtonVisibility();
			this.passIcon = "";
			return;
		}
		if (checkEmailValidity(this.email) == true) {
			this.emailOK = false;
			this.emailHelp = "";
			//this.loginHelp = "check in progress...";
			this.emailIcon = this.signUp_iconWait;
			let self = this;
			this.userService.checkEMail(this.email).then(function() {
					// check if the answer is correct with the question
					if (_newValue != self.email) {
						return;
					}
					// the email exist ... ==> it is found...
					self.emailOK = false;
					self.emailHelp = "email already used ...";
					self.emailIcon = self.signUp_iconWrong;
					self.updateButtonVisibility();
				}, function(error: number) {
					// check if the answer is correct with the question
					if (_newValue != self.email) {
						return;
					}
					if (error == 404) {
						self.emailOK = true;
						self.emailHelp = "";
						self.emailIcon = self.signUp_iconRight;
						self.updateButtonVisibility();
						return;
					}
					console.log("Status " + error);
					self.emailOK = false;
					self.emailHelp = "email already used ...";
					self.emailIcon = self.signUp_iconWrong;
					self.updateButtonVisibility();
				});
		} else {
			this.emailOK = false;
			this.emailHelp = 'Not valid: characters, numbers, "_-." and email format: you@example.com';
		}
		this.updateButtonVisibility();
	}
	
	checkPassword(_newValue:string):void {
		this.password = _newValue
		console.log("ooooooooooooooo " + this.password);
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
	onSignUp():void {
		console.log("Validate ... ");
		if (this.signUpButtonDisabled == true) {
			// TODO: ...  notify user ...
			console.log("Not permited action ... ==> control does not validate this action ...");
			return;
		}
		let self = this;
		// disable the currect button
		this.signUpButtonDisabled = true;
		this.userService.create(this.login, this.email, this.password).then(
			function(value) {
				console.log("User created");
				self.router.navigate(['login']);
				//TODO : send a generic message in the pop-up enevts... self.emailHelp = "email already used ... (error 2)";
			}, function(value) {
				console.log("User NOT created");
				//TODO : send a generic message in the pop-up enevts... self.emailHelp = "email already used ... (error 2)";
			});
	}
	onCancel():void {
		console.log("onCancel ... '" + this.login + "':'" + this.password + "'");
		//$rootScope.currentModal = "";
	}

}

