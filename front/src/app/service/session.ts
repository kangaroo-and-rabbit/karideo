/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Injectable, Output, EventEmitter } from '@angular/core'

enum USER_ROLES {
    admin = 10000,
    user = 1,
    guest = 10
}

@Injectable()
export class SessionService {
	public sessionData = null;
	public userLogin = null;
	public userAdmin = null;
	public userEMail = null;
	public userAvatar = null;
	//public tocken = null;
	
	@Output() change: EventEmitter<boolean> = new EventEmitter();
	
	constructor() {
		
	}
	/**
	 * @brief Create a new session.
	 */
	create(sessionData,
	       userLogin:string,
	       userEMail:string,
	       userAdmin:boolean,
	       userAvatar:string) {
		console.log("Session Create");
		this.sessionData = sessionData;
		this.userLogin = userLogin;
		this.userAdmin = userAdmin;
		this.userEMail = userEMail;
		this.userAvatar = userAvatar;
		this.change.emit(true);
	};
	/**
	 * @brief destroy the current session.
	 */
	destroy() {
		console.log("Session REMOVE");
		//Cookies.remove("yota-login");
		//Cookies.remove("yota-password");
		let last = this.sessionData;
		this.sessionData = null;
		this.userLogin = null;
		this.userAdmin = null;
		this.userEMail = null;
		this.userAvatar = null;
		this.change.emit(false);
	};
	islogged() {
		return this.sessionData != null;
	}
	hasRight(type) {
		if (type == USER_ROLES.admin) {
			// sometime needed...
			return this.userAdmin;
		}
		if (type == USER_ROLES.user) {
			// is connected ==> is user
			return this.sessionData != null;
		}
		if (type == USER_ROLES.guest) {
			// TODO all the other ... maybe unneeded
			return true;
		}
		return false;
	}
	hasNotRight(type) {
		return !this.hasRight(type);
	}
	getLogin() {
		return this.userLogin;
	}
	getAvatar() {
		if (this.userAvatar == "") {
			return "assets/images/avatar_generic.svg";
		}
		return this.userAvatar;
	}
}