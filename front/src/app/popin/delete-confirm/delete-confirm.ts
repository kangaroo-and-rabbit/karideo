/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input, Output, SimpleChanges, EventEmitter} from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { TypeService } from '../../service/type';
import { PopInService } from '../../service/popin';

@Component({
	selector: 'delete-confirm',
	templateUrl: './delete-confirm.html',
	styleUrls: ['./delete-confirm.less']
})

@Injectable()
export class PopInDeleteConfirm implements OnInit {

	@Input() comment: string = null;
	@Input() imageUrl: string = null;
	@Output() callback: EventEmitter<any> = new EventEmitter();
	
	public closeButtonTitle: string = "Cancel";
	public validateButtonTitle: string = "Validate";
	
	constructor(private router: Router,
	            private popInService: PopInService) {
		
	}
	
	OnDestroy() {
		
	}
	
	ngOnInit() {
		
	}
	
	eventPopUp(_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-delete-confirm");
		if (_event == "validate") {
			this.callback.emit(null);
		}
	}
	
}
