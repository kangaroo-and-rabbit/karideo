/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';

import { SaisonService } from '../../service/saison.service';
import { ArianeService } from '../../service/ariane.service';

@Component({
	selector: 'app-saison',
	templateUrl: './saison.component.html',
	styleUrls: ['./saison.component.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class SaisonComponent implements OnInit {
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
		this.id_saison = parseInt(this.route.snapshot.paramMap.get('saison_id'));
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
	
	onSelectVideo(_event: any, _idSelected: number):void {
		if(_event.which==2) {
			window.open('/video/' + _idSelected);
		} else {
			this.router.navigate(['video/' + _idSelected ]);
			this.arianeService.setVideo(_idSelected);
		}
	}

}
