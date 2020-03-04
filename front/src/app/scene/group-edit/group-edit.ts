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

import { GroupService } from '../../service/group';
import { DataService } from '../../service/data';

export class ElementList {
	value: number;
	label: string;
	constructor(_value: number, _label: string) {
		this.value = _value;
		this.label = _label;
	}
}

@Component({
	selector: 'app-group-edit',
	templateUrl: './group-edit.html',
	styleUrls: ['./group-edit.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
// https://www.sitepoint.com/angular-forms/
export class GroupEditComponent implements OnInit {
	id_group:number = -1;
	
	error:string = ""
	
	name:string = ""
	description:string = ""
	coverFile:File;
	upload_file_value:string = ""
	selectedFiles:FileList;
	
	covers_display:Array<string> = [];
	
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private dataService: DataService,
	            private groupService: GroupService) {
		
	}
	
	ngOnInit() {
		this.id_group = parseInt(this.route.snapshot.paramMap.get('group_id'));
		let self = this;
		this.groupService.get(this.id_group)
			.then(function(response) {
				console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.name = response.name;
				self.description = response.description;
				if (response.covers !== undefined && response.covers !== null) {
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers_display.push(self.groupService.getCoverUrl(response.covers[iii]));
					}
				} else {
					self.covers_display = []
				}
				console.log("covers_list : " + JSON.stringify(self.covers_display, null, 2));
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = "";
				self.description = "";
				self.covers_display = [];
			});
	}
	
	onName(_value:any):void {
		this.name = _value;
	}
	
	onDescription(_value:any):void {
		this.description = _value;
	}
	
	sendValues():void {
		console.log("send new values....");
		let data = {
			"name": this.name,
			"description": this.description
		};
		this.groupService.put(this.id_group, data);
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
				console.log("get response of video : " + JSON.stringify(response, null, 2));
				let id_of_image = response.id;
				self.groupService.addCover(self.id_group, id_of_image)
					.then(function(response) {
						console.log("cover added");
						self.covers_display.push(self.groupService.getCoverUrl(id_of_image));
					}).catch(function(response) {
						console.log("Can not cover in the cover_list...");
					});
			}).catch(function(response) {
				//self.error = "Can not get the data";
				console.log("Can not add the data in the system...");
			});
	}

}
