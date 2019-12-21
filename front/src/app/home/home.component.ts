/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { fadeInAnimation } from '../_animations/index';

import { TypeService } from '../type.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class HomeComponent implements OnInit {
	data_list = [{name:"lkjlkjlkj"}, {name:"lkjlkj222lkj"}, {name:"lkjlk333jlkj"}];
	error = "";
	constructor(private router: Router,
	            private locate: Location,
	            private typeService: TypeService) {
		
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
	}
	onSelectType(_idSelected: number):void {
		//this.router.navigate(['type/', { id: _idSelected} ]);
		this.router.navigate(['type/' + _idSelected ]);
	}

}
