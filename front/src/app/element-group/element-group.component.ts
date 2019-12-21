/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../group.service';

@Component({
	selector: 'app-element-group',
	templateUrl: './element-group.component.html',
	styleUrls: ['./element-group.component.less']
})

@Injectable()
export class ElementGroupComponent implements OnInit {
	// input parameters
	@Input() id_group:number = -1;
	@Input() id_type:number = -1;
	
	error:string = ""
	name:string = "plouf"
	
	constructor(private router: Router,
	            private groupService: GroupService) {
		
	}
	ngOnInit() {
		this.name = "ll " + this.id_type + "+" + this.id_group
		let self = this;
		console.log("get parameter id: " + this.id_type);
		this.groupService.get(this.id_group)
			.then(function(response) {
				self.error = "";
				self.name = response.name
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = ""
			});
	}
}
