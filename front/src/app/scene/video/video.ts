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
import { SeriesService } from '../../service/series';
import { SeasonService } from '../../service/season';
import { ArianeService } from '../../service/ariane';

@Component({
	selector: 'app-video',
	templateUrl: './video.html',
	styleUrls: ['./video.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class VideoScene implements OnInit {
	id_video:number = -1;

	mediaIsNotFound:boolean = false
	mediaIsLoading:boolean = true
	error:string = ""
	
	name:string = ""
	description:string = ""
	episode:number = undefined
	series_id:number = undefined
	series_name:string = undefined
	season_id:number = undefined
	season_name:string = undefined
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
	            private seriesService: SeriesService,
	            private seasonService: SeasonService,
	            private httpService: HttpWrapperService,
	            private arianeService: ArianeService) {
		
	}
	
	generateName() {
		this.generated_name = "";
		if (this.series_name != undefined) {
			this.generated_name += this.series_name + "-";
		}
		if (this.season_name != undefined) {
			if (this.season_name.length < 2) {
				this.generated_name += "s0" + this.season_name + "-";
			} else {
				this.generated_name += "s" + this.season_name + "-";
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
				self.series_id = response.series_id;
				self.season_id = response.season_id;
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
				if (self.series_id !== undefined && self.series_id !== null) {
					self.seriesService.get(self.series_id)
						.then(function(response) {
							self.series_name = response.name;
							self.generateName();
						}).catch(function(response) {
							// nothing to do ...
						});
				}
				if (self.season_id !== undefined && self.season_id !== null) {
					self.seasonService.get(self.season_id)
						.then(function(response) {
							self.season_name = response.name;
							self.generateName();
						}).catch(function(response) {
							// nothing to do ...
						});
				}
				self.mediaIsLoading = false;
				//console.log("display source " + self.video_source);
				//console.log("set transformed : " + JSON.stringify(self, null, 2));
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = "";
				self.description = "";
				self.episode = undefined;
				self.series_id = undefined;
				self.season_id = undefined;
				self.data_id = -1;
				self.time = undefined;
				self.generated_name = "";
				self.video_source = "";
				self.cover = null;
				self.series_name = undefined;
				self.season_name = undefined;
				self.mediaIsNotFound = true;
				self.mediaIsLoading = false;
			});
	}

}
