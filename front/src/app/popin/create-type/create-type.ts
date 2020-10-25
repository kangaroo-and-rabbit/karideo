/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { TypeService } from '../../service/type';
import { PopInService } from '../../service/popin';

@Component({
	selector: 'create-type',
	templateUrl: './create-type.html',
	styleUrls: ['./create-type.less']
})

@Injectable()
export class PopInCreateType implements OnInit {
	
	name: string = "";
	description: string = "";
	
	constructor(private router: Router,
	            private typeService: TypeService,
	            private popInService: PopInService) {
		
	}
	OnDestroy() {
		
	}
	ngOnInit() {
		
	}
	eventPopUp(_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-create-type");
	}
	updateNeedSend():void {
		
	}
	onName(_value:any):void {
		if (_value.length == 0) {
			this.name = "";
		} else {
			this.name = _value;
		}
		this.updateNeedSend();
	}
	
	onDescription(_value:any):void {
		if (_value.length == 0) {
			this.description = "";
		} else {
			this.description = _value;
		}
		this.updateNeedSend();
	}
}