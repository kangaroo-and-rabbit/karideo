/** @file
 * @author Edouard DUPIN
 * @copyright 2020, Edouard DUPIN, all right reserved
 * @license MPL-2 (see license file)
 */

import { Component, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import * as $ from 'jquery';

import { PopInService } from '../../service/popin';

@Component({
	moduleId: module.id.toString(),
	selector: 'popin',
	templateUrl: './popin.html',
	styleUrls: ['./popin.less']
})

export class PopInComponent implements OnInit, OnDestroy {
	@Input() id: string;
	@Input() popTitle: string = 'No title';
	@Input() closeTopRight: any = "false";
	@Input() popSize: string = "medium";
	
	@Output() callback: EventEmitter<any> = new EventEmitter();
	@Input() closeTitle: any = null;
	@Input() validateTitle: any = null;
	@Input() saveTitle: any = null;
	@Input() otherTitle: any = null;
	
	private element: any;
	constructor(private popInService: PopInService,
	            private el: ElementRef) {
		this.element = $(el.nativeElement);
	}
	ngOnInit(): void {
		// ensure id attribute exists
		if (!this.id) {
			console.error('popin must have an id');
			return;
		}
		// move element to bottom of page (just before </body>) so it can be displayed above everything else
		this.element.appendTo('body');
		this.popInService.add(this);
		this.element.hide();
	}
	// remove self from popIn service when directive is destroyed
	ngOnDestroy(): void {
		this.popInService.remove(this.id);
		this.element.remove();
	}
	// open popIn
	open(): void {
		this.element.show();
	}
	// close popin
	close(): void {
		this.element.hide();
	}
	
	onCloseTop(): void {
		this.callback.emit(["close-top"]);
	}
	
	onValidate(): void {
		this.callback.emit(["validate"]);
	}
	
	onClose(): void {
		this.callback.emit(["close"]);
	}
	
	onOther(): void {
		this.callback.emit(["other"]);
	}
	
	onSave(): void {
		this.callback.emit(["save"]);
	}
}