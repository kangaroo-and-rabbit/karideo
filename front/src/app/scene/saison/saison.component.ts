/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { SaisonService } from '../../service/saison.service';
import { GroupService } from '../../service/group.service';
import { ArianeService } from '../../service/ariane.service';
import { environment } from 'environments/environment';

@Component({
	selector: 'app-saison',
	templateUrl: './saison.component.html',
	styleUrls: ['./saison.component.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class SaisonComponent implements OnInit {
	name: string = "";
	group_name: string = "";
	description: string = "";
	group_id: number = null;
	cover: string = ""
	covers: Array<string> = []
	id_saison = -1;
	videos_error = "";
	videos = [];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private saisonService: SaisonService,
	            private groupService: GroupService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		this.id_saison = parseInt(this.route.snapshot.paramMap.get('saison_id'));
		this.arianeService.setSaison(this.id_saison);
		let self = this;
		this.saisonService.get(this.id_saison)
			.then(function(response) {
				self.name = response.number;
				self.group_id = response.group_id;
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
				self.groupService.get(self.group_id)
					.then(function(response) {
						self.group_name = response.name;
					}).catch(function(response) {
						self.group_name = "";
					});
			}).catch(function(response) {
				self.description = "";
				self.name = "???";
				self.group_name = "";
				self.group_id = null;
				self.cover = null;
				self.covers = [];
			});
		console.log("get parameter id: " + this.id_saison);
		this.saisonService.getVideo(this.id_saison)
			.then(function(response) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response) {
				self.videos_error = "Can not get the List of video without saison";
				self.videos = []
			});
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
