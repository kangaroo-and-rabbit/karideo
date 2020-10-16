/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input, SimpleChanges } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { TypeService } from '../../service/type';
import { PopInService } from '../../service/popin';

@Component({
	selector: 'upload-progress',
	templateUrl: './upload-progress.html',
	styleUrls: ['./upload-progress.less']
})

@Injectable()
export class PopInUploadProgress implements OnInit {
	
	@Input() mediaTitle: string = "";
	@Input() mediaUploaded: number = 0;
	@Input() mediaSize: number = 999999999999;
	private progress: number = 0;
	constructor(private router: Router,
	            private popInService: PopInService) {
		
	}
	OnDestroy() {
		
	}
	ngOnInit() {
		
	}
	eventPopUp(_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-upload-progress");
	}
	updateNeedSend():void {
		
	}
	ngOnChanges(changes: SimpleChanges) {
		this.progress = Math.trunc(this.mediaUploaded*100/this.mediaSize)
		console.log("ooooooooooo " + this.progress);
		console.log("ooooooooooo " + changes);
	}
}