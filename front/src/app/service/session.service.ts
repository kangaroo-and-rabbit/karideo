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
	public id = null;
	public userId = null;
	public userRole = null;
	public userEMail = null;
	public userAvatar = null;
	//public tocken = null;
	
	@Output() change: EventEmitter<boolean> = new EventEmitter();
	
	constructor() {
		
	}
	/**
	 * @brief Create a new session.
	 */
	create(sessionId,
	       userId,
	       userEMail:string,
	       userRole:string,
	       userAvatar:string) {
		console.log("Session Create");
		this.id = sessionId;
		this.userId = userId;
		this.userRole = userRole;
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
		let last = this.id;
		this.id = null;
		this.userId = null;
		this.userRole = null;
		this.userEMail = null;
		this.userAvatar = null;
		this.change.emit(false);
	};
	islogged() {
		return this.id != null;
	}
	hasRight(type) {
		if (type == USER_ROLES.admin) {
			return this.userRole == USER_ROLES.admin;
		}
		if (type == USER_ROLES.user) {
			return    this.userRole == USER_ROLES.admin
			       || this.userRole == USER_ROLES.user;
		}
		if (type == USER_ROLES.guest) {
			return    this.userRole == USER_ROLES.admin
			       || this.userRole == USER_ROLES.user
			       || this.userRole == USER_ROLES.guest;
		}
		return false;
	}
	hasNotRight(type) {
		return !this.hasRight(type);
	}
	getLogin() {
		return this.userId;
	}
	getAvatar() {
		if (this.userAvatar == "") {
			return "assets/images/avatar_generic.svg";
		}
		return this.userAvatar;
	}
}