/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { GroupService } from '../../service/group.service';
import { ArianeService } from '../../service/ariane.service';

@Component({
	selector: 'app-group',
	templateUrl: './group.component.html',
	styleUrls: ['./group.component.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class GroupComponent implements OnInit {
	//id_type = -1;
	//id_univers = -1;
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
		//this.id_univers = parseInt(this.route.snapshot.paramMap.get('univers_id'));
		//this.id_type = parseInt(this.route.snapshot.paramMap.get('type_id'));
		this.id_group = parseInt(this.route.snapshot.paramMap.get('group_id'));
		console.log
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
		this.groupService.getVideo(this.id_group)
			.then(function(response) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response) {
				self.videos_error = "Can not get the List of video without saison";
				self.videos = []
			});
	}
	onSelectSaison(_idSelected: number):void {
		//this.router.navigate(['/type/' + this.type_id + '/group/' + this.id_group + '/saison/' + _idSelected ]);
		this.router.navigate(['/saison/' + _idSelected ]);
		this.arianeService.setSaison(_idSelected);
	}
	
	onSelectVideo(_idSelected: number):void {
		//this.router.navigate(['/type/' + this.type_id + '/group/' + this.id_group + '/video/' + _idSelected ]);
		this.router.navigate(['/video/' + _idSelected ]);
		this.arianeService.setVideo(_idSelected);
	}

}
