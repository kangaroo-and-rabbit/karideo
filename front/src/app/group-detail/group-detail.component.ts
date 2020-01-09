/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../_animations/index';

import { GroupService } from '../group.service';
import { ArianeService } from '../ariane.service';

@Component({
	selector: 'app-group-detail',
	templateUrl: './group-detail.component.html',
	styleUrls: ['./group-detail.component.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class GroupDetailComponent implements OnInit {
	id_group = -1;
	saisons_error = "";
	saisons = [];
	videos_error = "";
	videos = [];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private groupService: GroupService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		this.id_group = parseInt(this.route.snapshot.paramMap.get('id'));
		let self = this;
		console.log("get parameter id: " + this.id_group);
		this.groupService.getSaison(this.id_group)
			.then(function(response) {
				self.saisons_error = "";
				self.saisons = response
			}).catch(function(response) {
				self.saisons_error = "Can not get the list of saison in this group";
				self.saisons = []
			});
		this.groupService.getVideoNoSaison(this.id_group)
			.then(function(response) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response) {
				self.videos_error = "Can not get the List of video without saison";
				self.videos = []
			});
	}
	onSelectSaison(_idSelected: number):void {
		this.router.navigate(['saison/' + _idSelected ]);
		this.arianeService.setSaison(_idSelected);
	}
	
	onSelectVideo(_idSelected: number):void {
		this.router.navigate(['video/' + _idSelected ]);
	}

}
