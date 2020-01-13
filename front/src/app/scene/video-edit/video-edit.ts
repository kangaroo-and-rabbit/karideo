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
import { HttpWrapperService } from '../../service/http-wrapper.service';


import { TypeService } from '../../service/type.service';
import { UniversService } from '../../service/univers.service';
import { VideoService } from '../../service/video.service';

export class ElementList {
	value: number;
	label: string;
	constructor(_value: number, _label: string) {
		this.value = _value;
		this.label = _label;
	}
}

@Component({
	selector: 'app-video-edit',
	templateUrl: './video-edit.html',
	styleUrls: ['./video-edit.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
// https://www.sitepoint.com/angular-forms/
export class VideoEditComponent implements OnInit {
	id_video:number = -1;
	
	error:string = ""
	
	name:string = ""
	description:string = ""
	episode:number = undefined
	univers_id:number = undefined
	group_id:number = undefined
	saison_id:number = undefined
	data_id:number = -1
	time:number = undefined
	type_id:number = undefined
	generated_name:string = ""
	video_source:string = ""
	listType: ElementList[] = [
		{value: undefined, label: '---'},
	];
	listUnivers: ElementList[] = [
		{value: undefined, label: '---'},
		{value: null, label: '---'},
	];
	listGroup: ElementList[] = [
		{value: undefined, label: '---'},
	];
	listSaison: ElementList[] = [
		{value: undefined, label: '---'},
	];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private typeService: TypeService,
	            private universService: UniversService,
	            private videoService: VideoService,
	            private httpService: HttpWrapperService) {
		
	}
	
	sendValues():void {
		console.log("send new values....");
	}
	
	ngOnInit() {
		this.id_video = parseInt(this.route.snapshot.paramMap.get('video_id'));
		let self = this;
		this.universService.getData()
			.then(function(response2) {
				self.listUnivers = [{value: undefined, label: '---'}];
				for(let iii= 0; iii < response2.length; iii++) {
					self.listUnivers.push({value: response2[iii].id, label: response2[iii].name});
				}
			}).catch(function(response2) {
				console.log("get response22 : " + JSON.stringify(response2, null, 2));
			});
		this.videoService.get(this.id_video)
			.then(function(response) {
				console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.name = response.name;
				self.description = response.description;
				self.episode = response.episode;
				self.type_id = response.type_id;
				self.typeService.getData()
					.then(function(response2) {
						self.listType = [{value: undefined, label: '---'}];
						for(let iii= 0; iii < response2.length; iii++) {
							self.listType.push({value: response2[iii].id, label: response2[iii].name});
						}
					}).catch(function(response2) {
						console.log("get response22 : " + JSON.stringify(response2, null, 2));
					});
				self.saison_id = response.saison_id;
				self.group_id = response.group_id;
				self.listGroup = [{value: undefined, label: '---'}];
				if (response.type_id != undefined) {
					self.typeService.getSubGroup(response.type_id)
						.then(function(response2) {
							for(let iii= 0; iii < response2.length; iii++) {
								self.listGroup.push({value: response2[iii].id, label: response2[iii].name});
							}
						}).catch(function(response2) {
							console.log("get response22 : " + JSON.stringify(response2, null, 2));
						});
				}
				self.univers_id = response.univers_id;
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
				self.univers_id = undefined;
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
