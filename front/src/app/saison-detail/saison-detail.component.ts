/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../_animations/index';

import { SaisonService } from '../saison.service';
import { ArianeService } from '../ariane.service';

@Component({
	selector: 'app-saison-detail',
	templateUrl: './saison-detail.component.html',
	styleUrls: ['./saison-detail.component.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class SaisonDetailComponent implements OnInit {
	id_saison = -1;
	videos_error = "";
	videos = [];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private saisonService: SaisonService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		this.id_saison = parseInt(this.route.snapshot.paramMap.get('id'));
		let self = this;
		console.log("get parameter id: " + this.id_saison);
		this.saisonService.getVideo(this.id_saison)
			.then(function(response) {
				self.videos_error = "";
				self.videos = response
			}).catch(function(response) {
				self.videos_error = "Can not get the List of video without saison";
				self.videos = []
			});
	}
	
	onSelectVideo(_idSelected: number):void {
		this.router.navigate(['video/' + _idSelected ]);
	}

}
