/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl } from "@angular/forms";
import { fadeInAnimation } from '../../_animations/index';
import { HttpWrapperService } from '../../http-wrapper.service';

import { VideoService } from '../../video.service';

@Component({
	selector: 'app-video-edit',
	templateUrl: './video-edit.html',
	styleUrls: ['./video-edit.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
/*
export class Video {
    name: string;
    description: string;
    episode: number;
    constructor() {
    }
}
*/
// https://www.sitepoint.com/angular-forms/
export class VideoEditComponent implements OnInit {
	id_video:number = -1;
	
	error:string = ""
	
	name:string = ""
	description:string = ""
	episode:number = undefined
	group_id:number = undefined
	saison_id:number = undefined
	data_id:number = -1
	time:number = undefined
	type_id:number = undefined
	generated_name:string = ""
	video_source:string = ""
	
	videoForm = new FormGroup({
		name: new FormControl("kjhkjhk"),
		description: new FormControl(),
		episode: new FormControl()
	})
	//video = new Video();
	
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private videoService: VideoService,
	            private httpService: HttpWrapperService) {
		
	}
	
	ngOnInit() {
		this.id_video = parseInt(this.route.snapshot.paramMap.get('id'));
		let self = this;
		this.videoService.get(this.id_video)
			.then(function(response) {
				console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.error = "";
				self.videoForm.get("name").setValue(response.name);
				self.videoForm.get("description").setValue(response.description);
				self.videoForm.get("episode").setValue(response.episode);
				
				self.name = response.name;
				self.description = response.description;
				self.episode = response.episode;
				self.group_id = response.group_id;
				self.saison_id = response.saison_id;
				self.data_id = response.data_id;
				self.time = response.time;
				self.generated_name = response.generated_name;
				if (self.data_id != -1) {
					self.video_source = self.httpService.createRESTCall("data/" + self.data_id);
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
				self.data_id = -1;
				self.time = undefined;
				self.generated_name = "";
				self.video_source = "";
			});
	}
	submitChange(videoForm:NgForm):void {
		console.log("videoForm form display" + videoForm);
		
	}

}
