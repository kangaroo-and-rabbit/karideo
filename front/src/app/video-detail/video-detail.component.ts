/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../_animations/index';

import { VideoService } from '../video.service';

@Component({
	selector: 'app-video-detail',
	templateUrl: './video-detail.component.html',
	styleUrls: ['./video-detail.component.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class VideoDetailComponent implements OnInit {
	id_video:number = -1;
	
	error:string = ""
	
	name:string = ""
	description:string = ""
	episode:number = undefined
	group_id:number = undefined
	saison_id:number = undefined
	sha512:string = ""
	time:number = undefined
	type_id:number = undefined
	generated_name:string = ""
	video_source:string = ""
	
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private videoService: VideoService) {
		
	}
	
	ngOnInit() {
		this.id_video = parseInt(this.route.snapshot.paramMap.get('id'));
		let self = this;
		this.videoService.get(this.id_video)
			.then(function(response) {
				console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.error = "";
				self.name = response.name;
				self.description = response.description;
				self.episode = response.episode;
				self.group_id = response.group_id;
				self.saison_id = response.saison_id;
				self.sha512 = response.sha512;
				self.time = response.time;
				self.generated_name = response.generated_name;
				if (self.sha512 != "") {
					self.video_source = "http://localhost:15080/data/" + self.sha512 + ".mp4";
				} else {
					self.video_source = "";
				}
				console.log("display source " + self.video_source);
				//console.log("set transformed : " + JSON.stringify(self, null, 2));
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = "";
				self.description = "";
				self.episode = undefined;
				self.group_id = undefined;
				self.saison_id = undefined;
				self.sha512 = "";
				self.time = undefined;
				self.generated_name = "";
				self.video_source = "";
			});
	}

}
