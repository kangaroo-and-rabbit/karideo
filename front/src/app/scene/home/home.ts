/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
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
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private typeService: TypeService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
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
		this.arianeService.navigateType(_idSelected, _event.which==2);
	}

}
