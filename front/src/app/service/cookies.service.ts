/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Injectable } from '@angular/core';

@Injectable()
export class CookiesService {
	
	constructor() {
		
	}
	
	set(cname, cvalue, exdays) {
		if (this.get(cname) != "") {
			// reset previous cookies...
			document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
		}
		let d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		let expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	
	remove(cname) {
		this.set(cname, "", 0);
	}
	
	get(cname) {
		let name = cname + "=";
		let ca = document.cookie.split(';');
		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
}

