/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArianeService } from '../../service/ariane';

@Component({
  selector: 'app-error-viewer',
  templateUrl: './error-viewer.html',
  styleUrls: ['./error-viewer.less']
})
export class ErrorViewerScene implements OnInit {

	constructor(private route: ActivatedRoute,
	            private arianeService: ArianeService) { }
	
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
	}

}

