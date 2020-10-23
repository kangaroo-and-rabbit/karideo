/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { SeasonService } from '../../service/season';

@Component({
	selector: 'app-element-season',
	templateUrl: './element-season.html',
	styleUrls: ['./element-season.less']
})

@Injectable()
export class ElementSeasonComponent implements OnInit {
	// input parameters
	@Input() id_season:number = -1;
	
	error:string = "";
	numberSeason:number = -1;
	count:number = null;
	cover:string = "";
	covers:Array<string> = [];
	description:string = "";
	
	constructor(private router: Router,
	            private seasonService: SeasonService) {
		
	}
	ngOnInit() {
		let self = this;
		console.log("get season properties id: " + this.id_season);
		this.seasonService.get(this.id_season)
			.then(function(response) {
				self.error = "";
				self.numberSeason = response.name;
				self.description = response.description;
				if (response.covers == undefined || response.covers == null || response.covers.length == 0) {
					self.cover = null;
					//self.covers = [];
				} else {
					self.cover = self.seasonService.getCoverThumbnailUrl(response.covers[0]);
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers.push(self.seasonService.getCoverThumbnailUrl(response.covers[iii]));
					}
				}
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.numberSeason = -1
				self.cover = null;
				self.covers = [];
				self.description = "";
			});
		this.seasonService.countVideo(this.id_season)
			.then(function(response) {
				self.count = response;
			}).catch(function(response) {
				self.count = null;
			});
	}
}
