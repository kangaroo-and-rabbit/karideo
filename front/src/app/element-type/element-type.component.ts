/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { TypeService } from '../type.service';

@Component({
	selector: 'app-element-type',
	templateUrl: './element-type.component.html',
	styleUrls: ['./element-type.component.less']
})

@Injectable()
export class ElementTypeComponent implements OnInit {
	// input parameters
	@Input() id_type:number = -1;
	
	error:string = ""
	name:string = ""
	description:string = ""
	constructor(private router: Router,
	            private typeService: TypeService) {
		
	}
	ngOnInit() {
		this.name = "ll " + this.id_type
		let self = this;
		console.log("get parameter id: " + this.id_type);
		this.typeService.get(this.id_type)
			.then(function(response) {
				self.error = "";
				self.name = response.name
				self.description = response.description
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = ""
				self.description = ""
			});
	}
}
