/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit} from '@angular/core';
import { UserService } from './service/user.service';
import { SessionService } from './service/session.service';
import { CookiesService } from './service/cookies.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [
		'./app.component.less',
		]
})
export class AppComponent implements OnInit {
	title = 'Karideo';
	constructor(private cookiesService: CookiesService,
	            private userService: UserService,
	            private sessionService: SessionService) {
		
	}
	
	ngOnInit() {
		let login = this.cookiesService.get("yota-login");
		let password = this.cookiesService.get("yota-password");
		if (    login != ""
		     && password != ""
		     && password.length > 40) {
			console.log("Get previous connection ... " + login + ":xxxxxx");
			let self = this;
			this.userService.loginSha(login, password)
			.then(function(response) {
				console.log("auto log ==> OK");
				self.sessionService.create(response['sessionId'],
				                           response['login'],
				                           response['email'],
				                           response['role'],
				                           response['avatar']);
				//self.router.navigate(['home']);
			}).catch(function(response) {
				console.log("auto log ==> Error");
				self.cookiesService.remove("yota-login");
				self.cookiesService.remove("yota-password");
			});
		}
		
	}

}

