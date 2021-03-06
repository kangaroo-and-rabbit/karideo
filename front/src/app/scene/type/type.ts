/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { TypeService } from '../../service/type';
import { ArianeService } from '../../service/ariane';

@Component({
	selector: 'app-type',
	templateUrl: './type.html',
	styleUrls: ['./type.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class TypeScene implements OnInit {
	type_id = -1;
	name: string = "";
	description: string = "";
	cover:string = null;
	seriess_error = "";
	seriess = [];
	videos_error = "";
	videos = [];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private typeService: TypeService,
	            private arianeService: ArianeService) {
		/*
		this.route.params.subscribe(params => {
				console.log(params);
				if (params["id"]) {
					this.doSearch(params["id"]);
				}
			});
		*/
	}
	
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		this.type_id = this.arianeService.getTypeId();
		let self = this;
		console.log("get parameter id: " + this.type_id);
		this.typeService.get(this.type_id)
			.then(function(response) {
				self.name = response.name;
				self.description = response.description;
			}).catch(function(response) {
				self.name = "???";
				self.description = "";
			});
		this.typeService.getSubSeries(this.type_id, ["id", "name"])
			.then(function(response) {
				self.seriess_error = "";
				self.seriess = response
			}).catch(function(response) {
				self.seriess_error = "Wrong e-mail/login or password";
				self.seriess = []
			});
		this.typeService.getSubVideo(this.type_id, ["id", "name"])
			.then(function(response) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response) {
				self.videos_error = "Wrong e-mail/login or password";
				self.videos = []
			});
	}
	onSelectSeries(_event: any, _idSelected: number):void {
		this.arianeService.navigateSeries(_idSelected, _event.which==2, _event.ctrlKey);
	}
	
	onSelectVideo(_event: any, _idSelected: number):void {
		this.arianeService.navigateVideo(_idSelected, _event.which==2, _event.ctrlKey);
	}

}
