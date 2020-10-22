/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { SaisonService } from '../../service/saison';

@Component({
	selector: 'app-element-saison',
	templateUrl: './element-saison.html',
	styleUrls: ['./element-saison.less']
})

@Injectable()
export class ElementSaisonComponent implements OnInit {
	// input parameters
	@Input() id_saison:number = -1;
	
	error:string = "";
	numberSaison:number = -1;
	count:number = null;
	cover:string = "";
	covers:Array<string> = [];
	description:string = "";
	
	constructor(private router: Router,
	            private saisonService: SaisonService) {
		
	}
	ngOnInit() {
		let self = this;
		console.log("get saison properties id: " + this.id_saison);
		this.saisonService.get(this.id_saison)
			.then(function(response) {
				self.error = "";
				self.numberSaison = response.name;
				self.description = response.description;
				if (response.covers == undefined || response.covers == null || response.covers.length == 0) {
					self.cover = null;
					//self.covers = [];
				} else {
					self.cover = self.saisonService.getCoverThumbnailUrl(response.covers[0]);
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers.push(self.saisonService.getCoverThumbnailUrl(response.covers[iii]));
					}
				}
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.numberSaison = -1
				self.cover = null;
				self.covers = [];
				self.description = "";
			});
		this.saisonService.countVideo(this.id_saison)
			.then(function(response) {
				self.count = response;
			}).catch(function(response) {
				self.count = null;
			});
	}
}
