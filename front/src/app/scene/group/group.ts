/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { GroupService } from '../../service/group';
import { ArianeService } from '../../service/ariane';
import { environment } from 'environments/environment';

@Component({
	selector: 'app-group',
	templateUrl: './group.html',
	styleUrls: ['./group.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class GroupComponent implements OnInit {
	//id_type = -1;
	//id_univers = -1;
	id_group = -1;
	name: string = "";
	description: string = "";
	cover: string = ""
	covers: Array<string> = []
	saisons_error: string = "";
	saisons: Array<number> = [];
	videos_error: string = "";
	videos: Array<number> = [];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private groupService: GroupService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		//this.id_univers = parseInt(this.route.snapshot.paramMap.get('univers_id'));
		//this.id_type = parseInt(this.route.snapshot.paramMap.get('type_id'));
		this.id_group = this.arianeService.getGroupId();
		let self = this;
		this.groupService.get(this.id_group)
			.then(function(response) {
				self.name = response.name;
				self.description = response.description;
				if (response.covers == undefined || response.covers == null || response.covers.length == 0) {
					self.cover = null;
					self.covers = [];
				} else {
					self.cover = self.groupService.getCoverUrl(response.covers[0]);
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers.push(self.groupService.getCoverUrl(response.covers[iii]));
					}
				}
			}).catch(function(response) {
				self.description = "";
				self.name = "???";
				self.cover = null;
				self.covers = [];
			});
		console.log("get parameter id: " + this.id_group);
		this.groupService.getSaison(this.id_group)
			.then(function(response) {
				self.saisons_error = "";
				self.saisons = response
			}).catch(function(response) {
				self.saisons_error = "Can not get the list of saison in this group";
				self.saisons = []
			});
		this.groupService.getVideo(this.id_group)
			.then(function(response) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response) {
				self.videos_error = "Can not get the List of video without saison";
				self.videos = []
			});
	}
	onSelectSaison(_event: any, _idSelected: number):void {
		this.arianeService.navigateSaison(_idSelected, _event.which==2);
	}
	
	onSelectVideo(_event: any, _idSelected: number):void {
		this.arianeService.navigateVideo(_idSelected, _event.which==2);
	}

}
