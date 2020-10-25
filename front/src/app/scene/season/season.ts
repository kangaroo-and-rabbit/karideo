/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { SeasonService } from '../../service/season';
import { SeriesService } from '../../service/series';
import { ArianeService } from '../../service/ariane';

@Component({
	selector: 'app-season',
	templateUrl: './season.html',
	styleUrls: ['./season.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class SeasonScene implements OnInit {
	name: string = "";
	series_name: string = "";
	description: string = "";
	series_id: number = null;
	cover: string = ""
	covers: Array<string> = []
	id_season = -1;
	videos_error = "";
	videos = [];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private seasonService: SeasonService,
	            private seriesService: SeriesService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		console.log("ngOnInit(SeasonComponent)");
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		this.id_season = this.arianeService.getSeasonId();
		
		let self = this;
		this.seasonService.get(this.id_season)
			.then(function(response:any) {
				self.name = response.name;
				self.series_id = response.parent_id;
				self.description = response.description;
				if (response.covers == undefined || response.covers == null || response.covers.length == 0) {
					self.cover = null;
					self.covers = [];
				} else {
					self.cover = self.seriesService.getCoverUrl(response.covers[0]);
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers.push(self.seriesService.getCoverUrl(response.covers[iii]));
					}
				}
				self.seriesService.get(self.series_id)
					.then(function(response:any) {
						self.series_name = response.name;
					}).catch(function(response:any) {
						self.series_name = "";
					});
			}).catch(function(response:any) {
				self.description = "";
				self.name = "???";
				self.series_name = "";
				self.series_id = null;
				self.cover = null;
				self.covers = [];
			});
		console.log("get parameter id: " + this.id_season);
		this.seasonService.getVideo(this.id_season)
			.then(function(response:any) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response:any) {
				self.videos_error = "Can not get the List of video without season";
				self.videos = []
			});
	}
	
	onSelectVideo(_event: any, _idSelected: number):void {
		this.arianeService.navigateVideo(_idSelected, _event.which==2);
		
	}

}
