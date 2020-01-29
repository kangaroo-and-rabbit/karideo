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
import { HttpWrapperService } from '../../service/http-wrapper.service';
import { HttpEventType, HttpResponse} from '@angular/common/http';


import { TypeService } from '../../service/type.service';
import { UniversService } from '../../service/univers.service';
import { GroupService } from '../../service/group.service';
import { VideoService } from '../../service/video.service';
import { DataService } from '../../service/data.service';

export class ElementList {
	value: number;
	label: string;
	constructor(_value: number, _label: string) {
		this.value = _value;
		this.label = _label;
	}
}

@Component({
	selector: 'app-video-edit',
	templateUrl: './video-edit.html',
	styleUrls: ['./video-edit.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
// https://www.sitepoint.com/angular-forms/
export class VideoEditComponent implements OnInit {
	id_video:number = -1;
	
	error:string = ""
	
	name:string = ""
	description:string = ""
	episode:number = undefined
	univers_id:number = undefined
	group_id:number = undefined
	saison_id:number = undefined
	data_id:number = -1
	time:number = undefined
	type_id:number = undefined
	generated_name:string = ""
	coverFile:File;
	upload_file_value:string = ""
	selectedFiles:FileList;
	
	covers_display:Array<string> = [];
	
	listType: ElementList[] = [
		{value: undefined, label: '---'},
	];
	listUnivers: ElementList[] = [
		{value: undefined, label: '---'},
		{value: null, label: '---'},
	];
	listGroup: ElementList[] = [
		{value: undefined, label: '---'},
	];
	listSaison: ElementList[] = [
		{value: undefined, label: '---'},
	];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private dataService: DataService,
	            private typeService: TypeService,
	            private universService: UniversService,
	            private groupService: GroupService,
	            private videoService: VideoService,
	            private httpService: HttpWrapperService) {
		
	}
	
	ngOnInit() {
		this.id_video = parseInt(this.route.snapshot.paramMap.get('video_id'));
		let self = this;
		this.listType = [{value: undefined, label: '---'}];
		this.listUnivers = [{value: undefined, label: '---'}];
		this.listGroup = [{value: undefined, label: '---'}];
		this.listSaison = [{value: undefined, label: '---'}];
		this.universService.getData()
			.then(function(response2) {
				for(let iii= 0; iii < response2.length; iii++) {
					self.listUnivers.push({value: response2[iii].id, label: response2[iii].name});
				}
			}).catch(function(response2) {
				console.log("get response22 : " + JSON.stringify(response2, null, 2));
			});
		this.typeService.getData()
			.then(function(response2) {
				for(let iii= 0; iii < response2.length; iii++) {
					self.listType.push({value: response2[iii].id, label: response2[iii].name});
				}
			}).catch(function(response2) {
				console.log("get response22 : " + JSON.stringify(response2, null, 2));
			});
		this.videoService.get(this.id_video)
			.then(function(response) {
				console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.name = response.name;
				self.description = response.description;
				self.episode = response.episode;
				self.univers_id = response.univers_id;
				self.data_id = response.data_id;
				self.time = response.time;
				self.generated_name = response.generated_name;
				self.onChangeType(response.type_id);
				self.onChangeGroup(response.group_id);
				self.saison_id = response.saison_id;
				if (response.covers !== undefined && response.covers !== null) {
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers_display.push(self.videoService.getCoverUrl(response.covers[iii]));
					}
				} else {
					self.covers_display = []
				}
				console.log("covers_list : " + JSON.stringify(self.covers_display, null, 2));
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = "";
				self.description = "";
				self.episode = undefined;
				self.group_id = undefined;
				self.univers_id = undefined;
				self.saison_id = undefined;
				self.data_id = -1;
				self.time = undefined;
				self.generated_name = "";
				self.covers_display = [];
			});
	}
	
	onChangeType(_value:any):void {
		console.log("Change requested of type ... " + _value);
		this.type_id = _value;
		this.group_id = null;
		this.saison_id = null;
		this.listGroup = [{value: undefined, label: '---'}];
		this.listSaison = [{value: undefined, label: '---'}];
		let self = this;
		if (this.type_id != undefined) {
			self.typeService.getSubGroup(this.type_id, ["id", "name"])
				.then(function(response2) {
					for(let iii= 0; iii < response2.length; iii++) {
						self.listGroup.push({value: response2[iii].id, label: response2[iii].name});
					}
				}).catch(function(response2) {
					console.log("get response22 : " + JSON.stringify(response2, null, 2));
				});
		}
	}
	
	onChangeUnivers(_value:any):void {
		this.univers_id = _value;
	}
	
	onChangeGroup(_value:any):void {
		this.group_id = _value;
		this.saison_id = null;
		this.listSaison = [{value: undefined, label: '---'}];
		let self = this;
		if (this.group_id != undefined) {
			self.groupService.getSaison(this.group_id, ["id", "number"])
				.then(function(response3) {
					for(let iii= 0; iii < response3.length; iii++) {
						self.listSaison.push({value: response3[iii].id, label: "saison " + response3[iii].number});
					}
				}).catch(function(response3) {
					console.log("get response22 : " + JSON.stringify(response3, null, 2));
				});
		}
	}
	onChangeSaison(_value:any):void {
		this.saison_id = _value;
	}
	
	onName(_value:any):void {
		this.name = _value;
	}
	
	onDescription(_value:any):void {
		this.description = _value;
	}
	
	onDate(_value:any):void {
		this.time = _value;
	}
	
	onEpisode(_value:any):void {
		this.episode = parseInt(_value, 10);
		//this.episode = _value;
	}
	
	sendValues():void {
		console.log("send new values....");
		let data = {
			"name": this.name,
			"description": this.description,
			"episode": this.episode,
			"time": this.time,
			"type_id": this.type_id,
			"univers_id": this.univers_id,
			"group_id": this.group_id,
			"saison_id": this.saison_id
		};
		this.videoService.put(this.id_video, data);
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
				self.videoService.addCover(self.id_video, id_of_image)
					.then(function(response) {
						console.log("cover added");
						self.covers_display.push(self.videoService.getCoverUrl(id_of_image));
					}).catch(function(response) {
						console.log("Can not cover in the cover_list...");
					});
			}).catch(function(response) {
				//self.error = "Can not get the data";
				console.log("Can not add the data in the system...");
			});
	}

}
