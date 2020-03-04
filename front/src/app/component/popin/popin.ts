import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
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
	@Input() title: string = 'No title';
	@Input() closeOnOutClick: any = "false";
	private element: any;
	constructor(private popInService: PopInService,
	            private el: ElementRef) {
		this.element = $(el.nativeElement);
	}
	ngOnInit(): void {
		let self = this;
		// ensure id attribute exists
		if (!this.id) {
			console.error('popin must have an id');
			return;
		}
		// move element to bottom of page (just before </body>) so it can be displayed above everything else
		this.element.appendTo('body');
		if (this.closeOnOutClick == "true") {
			// close popin on background click
			this.element.on('click', function (e: any) {
				let target = $(e.target);
				if (!target.closest('.modal-body').length) {
					self.close();
				}
			});
		}
		// add self (this popin instance) to the popin service so it's accessible from controllers
		this.popInService.add(this);
	}
	// remove self from popIn service when directive is destroyed
	ngOnDestroy(): void {
		this.popInService.remove(this.id);
		this.element.remove();
	}
	// open popIn
	open(): void {
		//console.log("request element show ...");
		this.element.show();
		//$('body').addClass('popin-open');
		//console.log("    ==> done");
	}
	// close popin
	close(): void {
		this.element.hide();
		//$('body').removeClass('popin-open');
	}
}