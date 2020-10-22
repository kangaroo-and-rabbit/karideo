/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { VideoService } from '../../service/video';
import { HttpWrapperService } from '../../service/http-wrapper';

@Component({
	selector: 'app-element-video',
	templateUrl: './element-video.html',
	styleUrls: ['./element-video.less']
})

@Injectable()
export class ElementVideoComponent implements OnInit {
	// input parameters
	@Input() id_video:number = -1;
	@Input() display_video:boolean = false;
	
	error:string = "";
	
	name:string = "";
	description:string = "";
	episode:number = undefined;
	group_id:number = undefined;
	saison_id:number = undefined;
	data_id:number = -1;
	time:number = undefined;
	type_id:number = undefined;
	generated_name:string = "";
	video_source:string = "";
	video_enable:boolean = false;
	imageSource:string = null;
	episode_display:string = "";
	
	cover:string = "";
	covers:Array<string> = [];
	
	constructor(private router: Router,
	            private videoService: VideoService,
	            private httpService: HttpWrapperService) {
		
	}
	OnDestroy() {
		this.video_source = "";
		this.video_enable = false;
	}
	ngOnInit() {
		this.name = "ll " +  this.id_video
		let self = this;
		//console.log("get video id: " + this.id_video);
		this.videoService.get(this.id_video)
			.then(function(response) {
				//console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.error = "";
				self.name = response.name;
				self.description = response.description;
				self.episode = response.episode;
				if (response.episode === undefined || response.episode === null || response.episode == '') {
					self.episode_display = "";
				} else {
					self.episode_display = response.episode + " - ";
				}
				self.group_id = response.serie_id;
				self.saison_id = response.saison_id;
				self.data_id = response.data_id;
				self.time = response.time;
				self.generated_name = response.generated_name;
				if (self.data_id != -1) {
					self.video_source = self.httpService.createRESTCall("data/" + self.data_id);
					self.video_enable = true;
				} else {
					self.video_source = "";
					self.video_enable = false;
				}
				if (response.covers == undefined || response.covers == null || response.covers.length == 0) {
					self.cover = null;
					//self.covers = [];
				} else {
					self.cover = self.videoService.getCoverThumbnailUrl(response.covers[0]);
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers.push(self.videoService.getCoverThumbnailUrl(response.covers[iii]));
					}
				}
				//console.log("101010 " + self.video_enable + "  " + self.video_source);
				//console.log("set transformed : " + JSON.stringify(self, null, 2));
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = "";
				self.description = "";
				self.episode = undefined;
				self.episode_display = "";
				self.group_id = undefined;
				self.saison_id = undefined;
				self.data_id = -1;
				self.time = undefined;
				self.generated_name = "";
				self.video_source = "";
				self.video_enable = false;
				self.cover = null;
				self.covers = [];
			});
	}
}