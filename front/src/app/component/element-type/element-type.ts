/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { TypeService } from '../../service/type';

@Component({
	selector: 'app-element-type',
	templateUrl: './element-type.html',
	styleUrls: ['./element-type.less']
})

@Injectable()
export class ElementTypeComponent implements OnInit {
	// input parameters
	@Input() id_type:number = -1;
	
	imageSource:string = ""
	name:string = ""
	error:string = ""
	description:string = ""
	
	cover:string = ""
	covers:Array<string> = []
	
	constructor(private router: Router,
	            private typeService: TypeService) {
		
	}
	ngOnInit() {
		this.name = "ll " + this.id_type
		let self = this;
		console.log("get parameter id: " + this.id_type);
		this.typeService.get(this.id_type)
			.then(function(response) {
				self.error = "";
				self.name = response.name
				self.description = response.description
				if (response.covers == undefined || response.covers == null || response.covers.length == 0) {
					self.cover = null;
					//self.covers = [];
				} else {
					self.cover = self.typeService.getCoverUrl(response.covers[0]);
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers.push(self.typeService.getCoverUrl(response.covers[iii]));
					}
				}
				console.log("plouf : '" + self.name + "'");
				switch (self.name) {
					case "Documentary":
						self.imageSource = "assets/images/type_documentary.svg";
						break;
					case "Movie":
						self.imageSource = "assets/images/type_film.svg";
						break;
					case "Annimation":
						self.imageSource = "assets/images/type_annimation.svg";
						break;
					case "Short Films":
						self.imageSource = "assets/images/type_film-short.svg";
						break;
					case "tv show":
						self.imageSource = "assets/images/type_tv-show.svg";
						break;
					case "Anniation tv show":
						self.imageSource = "assets/images/type_tv-show-annimation.svg";
						break;
					case "Theater":
						self.imageSource = "assets/images/type_theater.svg";
						break;
					case "One man show":
						self.imageSource = "assets/images/type_one-man-show.svg";
						break;
					case "Concert":
						self.imageSource = "assets/images/type_concert.svg";
						break;
					case "Opera":
						self.imageSource = "assets/images/type_opera.svg";
						break;
				}
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = "";
				self.description = "";
				self.imageSource = "";
				self.cover = null;
				self.covers = [];
			});
	}
}
