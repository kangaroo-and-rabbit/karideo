/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit, Input } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { SaisonService } from '../../service/saison.service';

@Component({
	selector: 'app-element-saison',
	templateUrl: './element-saison.component.html',
	styleUrls: ['./element-saison.component.less']
})

@Injectable()
export class ElementSaisonComponent implements OnInit {
	// input parameters
	@Input() id_saison:number = -1;
	
	error:string = ""
	numberSaison:number = -1
	constructor(private router: Router,
	            private saisonService: SaisonService) {
		
	}
	ngOnInit() {
		let self = this;
		console.log("get saison properties id: " + this.id_saison);
		this.saisonService.get(this.id_saison)
			.then(function(response) {
				self.error = "";
				self.numberSaison = response.number
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.numberSaison = -1
			});
	}
}
