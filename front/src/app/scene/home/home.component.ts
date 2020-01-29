/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { TypeService } from '../../service/type.service';
import { ArianeService } from '../../service/ariane.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
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
			}).catch(function(response) {
				self.error = "Wrong e-mail/login or password";
				self.data_list = []
			});
		this.arianeService.reset();
	}
	onSelectType(_event: any, _idSelected: number):void {
		if(_event.which==2) {
			window.open('/type/' + _idSelected);
		} else {
			this.arianeService.setType(_idSelected);
			//this.router.navigate(['type/', { id: _idSelected} ]);
			this.router.navigate(['type/' + _idSelected ]);
		}
	}

}
