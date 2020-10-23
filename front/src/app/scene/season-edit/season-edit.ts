/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl } from "@angular/forms";
import { fadeInAnimation } from '../../_animations/index';

import { SeasonService } from '../../service/season';
import { DataService } from '../../service/data';
import { ArianeService } from '../../service/ariane';

export class ElementList {
	value: number;
	label: string;
	constructor(_value: number, _label: string) {
		this.value = _value;
		this.label = _label;
	}
}

@Component({
	selector: 'app-season-edit',
	templateUrl: './season-edit.html',
	styleUrls: ['./season-edit.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
// https://www.sitepoint.com/angular-forms/
export class SeasonEditScene implements OnInit {
	id_season:number = -1;
	
	error:string = "";
	
	numberVal:number = null;
	description:string = "";
	coverFile:File;
	upload_file_value:string = ""
	selectedFiles:FileList;
	
	covers_display:Array<string> = [];
	
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private dataService: DataService,
	            private seasonService: SeasonService,
	            private arianeService: ArianeService) {
		
	}
	
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		this.id_season = this.arianeService.getSeasonId();
		let self = this;
		this.seasonService.get(this.id_season)
			.then(function(response) {
				console.log("get response of season : " + JSON.stringify(response, null, 2));
				self.numberVal = response.number;
				self.description = response.description;
				if (response.covers !== undefined && response.covers !== null) {
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers_display.push(self.seasonService.getCoverUrl(response.covers[iii]));
					}
				} else {
					self.covers_display = []
				}
				console.log("covers_list : " + JSON.stringify(self.covers_display, null, 2));
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.numberVal = null;
				self.description = "";
				self.covers_display = [];
			});
	}
	
	onNumber(_value:any):void {
		this.numberVal = _value;
	}
	
	onDescription(_value:any):void {
		this.description = _value;
	}
	
	sendValues():void {
		console.log("send new values....");
		let data = {
			"number": this.numberVal,
			"description": this.description
		};
		this.seasonService.put(this.id_season, data);
	}
	
	// At the drag drop area
	// (drop)="onDropFile($event)"
	onDropFile(_event: DragEvent) {
		_event.preventDefault();
		this.uploadFile(_event.dataTransfer.files[0]);
	}
	
	// At the drag drop area
	// (dragover)="onDragOverFile($event)"
	onDragOverFile(_event) {
		_event.stopPropagation();
		_event.preventDefault();
	}
	
	// At the file input element
	// (change)="selectFile($event)"
	onChangeCover(_value:any):void {
		this.selectedFiles = _value.files
		this.coverFile = this.selectedFiles[0];
		console.log("select file " + this.coverFile.name);
		this.uploadFile(this.coverFile);
	}
	
	uploadFile(_file:File) {
		if (_file == undefined) {
			console.log("No file selected!");
			return;
		}
		let self = this;
		this.dataService.sendFile(_file)
			.then(function(response) {
				console.log("get response of season : " + JSON.stringify(response, null, 2));
				let id_of_image = response.id;
				self.seasonService.addCover(self.id_season, id_of_image)
					.then(function(response) {
						console.log("cover added");
						self.covers_display.push(self.seasonService.getCoverUrl(id_of_image));
					}).catch(function(response) {
						console.log("Can not cover in the cover_list...");
					});
			}).catch(function(response) {
				//self.error = "Can not get the data";
				console.log("Can not add the data in the system...");
			});
	}

}
