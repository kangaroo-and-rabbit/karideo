/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { TypeService } from '../../service/type';
import { ArianeService } from '../../service/ariane';
import { environment } from 'environments/environment';

@Component({
	selector: 'app-home',
	templateUrl: './home.html',
	styleUrls: ['./home.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class HomeComponent implements OnInit {
	data_list = [];
	error = "";
	constructor(private router: Router,
	            private locate: Location,
	            private typeService: TypeService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		let self = this
		this.typeService.getData()
			.then(function(response) {
				self.error = "";
				self.data_list = response
				console.log("Get response: " + JSON.stringify(response, null, 2));
			}).catch(function(response) {
				self.error = "Wrong e-mail/login or password";
				console.log("[E] " + self.constructor.name + ": Does not get a correct response from the server ...");
				self.data_list = []
			});
		this.arianeService.reset();
	}
	onSelectType(_event: any, _idSelected: number):void {
		if(_event.which==2) {
			if (environment.frontBaseUrl === undefined || environment.frontBaseUrl === null || environment.frontBaseUrl === "") {
				window.open('/type/' + _idSelected);
			} else {
				window.open("/" + environment.frontBaseUrl + '/type/' + _idSelected);
			}
		} else {
			this.arianeService.setType(_idSelected);
			//this.router.navigate(['type/', { id: _idSelected} ]);
			this.router.navigate(['type/' + _idSelected ]);
		}
	}

}
