/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { SeriesService } from '../../service/series';
import { ArianeService } from '../../service/ariane';

@Component({
	selector: 'app-series',
	templateUrl: './series.html',
	styleUrls: ['./series.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class SeriesScene implements OnInit {
	//id_type = -1;
	//id_universe = -1;
	id_series = -1;
	name: string = "";
	description: string = "";
	cover: string = ""
	covers: Array<string> = []
	seasons_error: string = "";
	seasons: Array<number> = [];
	videos_error: string = "";
	videos: Array<number> = [];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private seriesService: SeriesService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		//this.id_universe = parseInt(this.route.snapshot.paramMap.get('univers_id'));
		//this.id_type = parseInt(this.route.snapshot.paramMap.get('type_id'));
		this.id_series = this.arianeService.getSeriesId();
		let self = this;
		this.seriesService.get(this.id_series)
			.then(function(response) {
				self.name = response.name;
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
			}).catch(function(response) {
				self.description = "";
				self.name = "???";
				self.cover = null;
				self.covers = [];
			});
		console.log("get parameter id: " + this.id_series);
		this.seriesService.getSeason(this.id_series, ["id", "name"])
			.then(function(response) {
				self.seasons_error = "";
				self.seasons = response
			}).catch(function(response) {
				self.seasons_error = "Can not get the list of season in this series";
				self.seasons = []
			});
		this.seriesService.getVideo(this.id_series)
			.then(function(response) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response) {
				self.videos_error = "Can not get the List of video without season";
				self.videos = []
			});
	}
	onSelectSeason(_event: any, _idSelected: number):void {
		this.arianeService.navigateSeason(_idSelected, _event.which==2);
	}
	
	onSelectVideo(_event: any, _idSelected: number):void {
		this.arianeService.navigateVideo(_idSelected, _event.which==2);
	}

}
