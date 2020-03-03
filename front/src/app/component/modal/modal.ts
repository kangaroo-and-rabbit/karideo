import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';

import { ModalService } from '../../service/modal';

@Component({
	moduleId: module.id.toString(),
	selector: 'modal',
	templateUrl: './modal.html',
	styleUrls: ['./modal.less']
})

export class ModalComponent implements OnInit, OnDestroy {
	@Input() id: string;
	@Input() title: string = 'No title';
	@Input() closeOnOutClick: any = "false";
	private element: any;
	constructor(private modalService: ModalService,
	            private el: ElementRef) {
		this.element = $(el.nativeElement);
	}
	ngOnInit(): void {
		let modal = this;
		// ensure id attribute exists
		if (!this.id) {
			console.error('modal must have an id');
			return;
		}
		// move element to bottom of page (just before </body>) so it can be displayed above everything else
		this.element.appendTo('body');
		if (this.closeOnOutClick == "true") {
			// close modal on background click
			this.element.on('click', function (e: any) {
				let target = $(e.target);
				if (!target.closest('.modal-body').length) {
					modal.close();
				}
			});
		}
		// add self (this modal instance) to the modal service so it's accessible from controllers
		this.modalService.add(this);
	}
	// remove self from modal service when directive is destroyed
	ngOnDestroy(): void {
		this.modalService.remove(this.id);
		this.element.remove();
	}
	// open modal
	open(): void {
		//console.log("request element show ...");
		this.element.show();
		//$('body').addClass('modal-open');
		//console.log("    ==> done");
	}
	// close modal
	close(): void {
		this.element.hide();
		//$('body').removeClass('modal-open');
	}
}