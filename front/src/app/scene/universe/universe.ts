/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { UniverseService } from '../../service/universe';
import { ArianeService } from '../../service/ariane';

import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-universe',
	templateUrl: './universe.html',
	styleUrls: ['./universe.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class UniverseScene implements OnInit {
	universe_id = -1;
	videos_error = "";
	videos = [];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private universeService: UniverseService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		this.universe_id = this.arianeService.getUniverseId();
		let self = this;
		console.log("get parameter id: " + this.universe_id);
		/*
		this.universeService.getVideo(this.univers_id)
			.then(function(response) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response) {
				self.videos_error = "Can not get the List of video without season";
				self.videos = []
			});
		*/
	}
	
	onSelectVideo(_event: any, _idSelected: number):void {
		if(_event.which==2) {
			if (environment.frontBaseUrl === undefined || environment.frontBaseUrl === null || environment.frontBaseUrl === "") {
				window.open('/video/' + _idSelected);
			} else {
				window.open("/" + environment.frontBaseUrl + '/video/' + _idSelected);
			}
		} else {
			this.router.navigate(['video/' + _idSelected ]);
			this.arianeService.setVideo(_idSelected);
		}
	}

}
