/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';
import { HttpWrapperService } from '../../service/http-wrapper';
import { VideoService } from '../../service/video';
import { GroupService } from '../../service/group';
import { SaisonService } from '../../service/saison';
import { ArianeService } from '../../service/ariane';

@Component({
	selector: 'app-video',
	templateUrl: './video.html',
	styleUrls: ['./video.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class VideoComponent implements OnInit {
	id_video:number = -1;
	
	error:string = ""
	
	name:string = ""
	description:string = ""
	episode:number = undefined
	group_id:number = undefined
	group_name:string = undefined
	saison_id:number = undefined
	saison_name:string = undefined
	data_id:number = -1
	time:number = undefined
	type_id:number = undefined
	generated_name:string = ""
	video_source:string = ""
	cover:string = ""
	covers:Array<string> = []
	
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private videoService: VideoService,
	            private groupService: GroupService,
	            private saisonService: SaisonService,
	            private httpService: HttpWrapperService,
	            private arianeService: ArianeService) {
		
	}
	
	generateName() {
		this.generated_name = "";
		if (this.group_name != undefined) {
			this.generated_name += this.group_name + "-";
		}
		if (this.saison_name != undefined) {
			if (this.saison_name.length < 2) {
				this.generated_name += "s0" + this.saison_name + "-";
			} else {
				this.generated_name += "s" + this.saison_name + "-";
			}
		}
		if (this.episode != undefined) {
			if (this.episode < 10) {
				this.generated_name += "e0" + this.episode + "-";
			} else {
				this.generated_name += "e" + this.episode + "-";
			}
		}
		this.generated_name += this.name;
	}
	
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		
		this.id_video = this.arianeService.getVideoId();
		let self = this;
		this.videoService.get(this.id_video)
			.then(function(response) {
				console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.error = "";
				self.name = response.name;
				self.description = response.description;
				self.episode = response.episode;
				self.group_id = response.serie_id;
				self.saison_id = response.saison_id;
				self.data_id = response.data_id;
				self.time = response.time;
				self.generated_name = response.generated_name;
				if (self.data_id != -1) {
					self.video_source = self.httpService.createRESTCall("data/" + self.data_id);
				} else {
					self.video_source = "";
				}
				if (response.covers == undefined || response.covers == null || response.covers.length == 0) {
					self.cover = null;
				} else {
					self.cover = self.videoService.getCoverUrl(response.covers[0]);
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers.push(self.videoService.getCoverUrl(response.covers[iii]));
					}
				}
				self.generateName();
				if (self.group_id !== undefined && self.group_id !== null) {
					self.groupService.get(self.group_id)
						.then(function(response) {
							self.group_name = response.name;
							self.generateName();
						}).catch(function(response) {
							// nothing to do ...
						});
				}
				if (self.saison_id !== undefined && self.saison_id !== null) {
					self.saisonService.get(self.saison_id)
						.then(function(response) {
							self.saison_name = response.name;
							self.generateName();
						}).catch(function(response) {
							// nothing to do ...
						});
				}
				//console.log("display source " + self.video_source);
				//console.log("set transformed : " + JSON.stringify(self, null, 2));
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = "";
				self.description = "";
				self.episode = undefined;
				self.group_id = undefined;
				self.saison_id = undefined;
				self.data_id = -1;
				self.time = undefined;
				self.generated_name = "";
				self.video_source = "";
				self.cover = null;
				self.group_name = undefined;
				self.saison_name = undefined;
			});
	}

}
