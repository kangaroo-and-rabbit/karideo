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
	@Input() result: string = null;
	@Input() error: string = null;
	public closeButtonTitle: string = "Abort";
	public otherButtonTitle: string = null;
	public validateButtonTitle: string = null;
	public uploadDisplay: string = "";
	public sizeDisplay: string = "";
	public progress: number = 0;
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

	limit3(count:number):string {
		if (count>=1000) {
			return "" + count;
		}
		if (count>=100) {
			return " " + count;
		}
		if (count>=10) {
			return "  " + count;
		}
		return "   " + count;
	}
	convertInHuman(countIn:number):string {
		let count = countIn;
		let tera = Math.trunc(count/(1024*1024*1024*1024));
		count = count - tera*1024*1024*1024*1024;
		let giga = Math.trunc(count/(1024*1024*1024));
		count = count - giga*1024*1024*1024;
		let mega = Math.trunc(count/(1024*1024));
		count = count - mega*1024*1024;
		let kilo = Math.trunc(count/1024);
		count = count - kilo*1024;
		let out = ""
		if (out.length != 0 || tera != 0) {
			out += " " + this.limit3(tera) + "T";
		}
		if (out.length != 0 || giga != 0) {
			out += " " + this.limit3(giga) + "G";
		}
		if (out.length != 0 || mega != 0) {
			out += " " + this.limit3(mega)+ "M";
		}
		if (out.length != 0 || kilo != 0) {
			out += " " + this.limit3(kilo) + "k";
		}
		if (out.length != 0 || count != 0) {
			out += " " + this.limit3(count) + "B";
		}
		return out;
	}
	
	ngOnChanges(changes: SimpleChanges) {
		this.progress = Math.trunc(this.mediaUploaded*100/this.mediaSize)
		this.uploadDisplay = this.convertInHuman(this.mediaUploaded);
		this.sizeDisplay = this.convertInHuman(this.mediaSize);
		if ( this.error == null && this.result == null) {
			this.closeButtonTitle = "Abort";
			this.otherButtonTitle = null;
			this.validateButtonTitle = null;
		} else if (this.result == null) {
			this.closeButtonTitle = null;
			this.otherButtonTitle = "Close";
			this.validateButtonTitle = null;
		} else {
			this.closeButtonTitle = null;
			this.otherButtonTitle = null;
			this.validateButtonTitle = "Ok";
		}
	}
}