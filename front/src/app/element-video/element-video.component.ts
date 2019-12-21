/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { VideoService } from '../video.service';

@Component({
	selector: 'app-element-video',
	templateUrl: './element-video.component.html',
	styleUrls: ['./element-video.component.less']
})

@Injectable()
export class ElementVideoComponent implements OnInit {
	// input parameters
	@Input() id_video:number = -1;
	
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
	constructor(private router: Router,
	            private videoService: VideoService) {
		
	}
	ngOnInit() {
		this.name = "ll " +  this.id_video
		let self = this;
		console.log("get parameter id: " + this.id_video);
		this.videoService.get(this.id_video)
			.then(function(response) {
				self.error = "";
				self.name = response.name
				self.description = response.description
				self.episode = response.episode
				self.group_id = response.group_id
				self.saison_id = response.saison_id
				self.sha512 = response.sha512
				self.time = response.time
				self.generated_name = response.generated_name
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = ""
				self.description = ""
				self.episode = undefined
				self.group_id = undefined
				self.saison_id = undefined
				self.sha512 = ""
				self.time = undefined
				self.generated_name = ""
			});
	}
}