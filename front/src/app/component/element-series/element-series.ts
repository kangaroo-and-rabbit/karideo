/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { SeriesService } from '../../service/series';

@Component({
	selector: 'app-element-series',
	templateUrl: './element-series.html',
	styleUrls: ['./element-series.less']
})

@Injectable()
export class ElementSeriesComponent implements OnInit {
	// input parameters
	@Input() id_series:number = -1;
	@Input() id_type:number = -1;
	
	error:string = "";
	name:string = "plouf";
	description:string = "";
	countvideo:number = null;
	imageSource:string = null;
	
	cover:string = "";
	covers:Array<string> = [];
	
	constructor(private router: Router,
	            private seriesService: SeriesService) {
		
	}
	ngOnInit() {
		this.name = "ll " + this.id_type + "+" + this.id_series
		let self = this;
		console.log("get parameter id: " + this.id_type);
		this.seriesService.get(this.id_series)
			.then(function(response) {
				self.error = "";
				self.name = response.name
				if (response.covers == undefined || response.covers == null || response.covers.length == 0) {
					self.cover = null;
					//self.covers = [];
				} else {
					self.cover = self.seriesService.getCoverThumbnailUrl(response.covers[0]);
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers.push(self.seriesService.getCoverThumbnailUrl(response.covers[iii]));
					}
				}
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = ""
				self.cover = null;
				self.covers = [];
			});
		this.seriesService.countVideo(this.id_series)
			.then(function(response) {
				self.countvideo = response;
			}).catch(function(response) {
				self.countvideo = 0;
			});
	}
}
