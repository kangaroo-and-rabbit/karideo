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


import { ModalService } from '../../service/modal';
import { TypeService } from '../../service/type.service';
import { UniversService } from '../../service/univers.service';
import { GroupService } from '../../service/group.service';
import { VideoService } from '../../service/video.service';
import { DataService } from '../../service/data.service';
import { ArianeService } from '../../service/ariane.service';

export class ElementList {
	value: number;
	label: string;
	constructor(_value: number, _label: string) {
		this.value = _value;
		this.label = _label;
	}
}


class DataToSend {
	name:string = ""
	description:string = ""
	episode:number = undefined
	univers_id:number = undefined
	serie_id:number = undefined
	saison_id:number = undefined
	data_id:number = -1
	time:number = undefined
	type_id:number = undefined
	covers:Array<any> = [];
	generated_name:string = ""
	clone() {
		let tmp = new DataToSend();
		tmp.name = this.name
		tmp.description = this.description
		tmp.episode = this.episode
		tmp.univers_id = this.univers_id
		tmp.serie_id = this.serie_id
		tmp.saison_id = this.saison_id
		tmp.data_id = this.data_id
		tmp.time = this.time
		tmp.type_id = this.type_id
		tmp.covers = this.covers
		tmp.generated_name = this.generated_name
		return tmp;
	}
};

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
	
	data:DataToSend = new DataToSend();
	data_ori:DataToSend = new DataToSend();
	coverFile:File;
	upload_file_value:string = ""
	selectedFiles:FileList;
	need_send:boolean = false;
	
	covers_display:Array<any> = [];
	
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
	            private httpService: HttpWrapperService,
	            private arianeService: ArianeService,
	            private modalService: ModalService) {
		
	}
	
	updateNeedSend(): boolean {
		this.need_send = false;
		if (this.data.name != this.data_ori.name) {
			this.need_send = true;
		}
		if (this.data.description != this.data_ori.description) {
			this.need_send = true;
		}
		if (this.data.episode != this.data_ori.episode) {
			this.need_send = true;
		}
		if (this.data.time != this.data_ori.time) {
			this.need_send = true;
		}
		if (this.data.type_id != this.data_ori.type_id) {
			this.need_send = true;
		}
		if (this.data.univers_id != this.data_ori.univers_id) {
			this.need_send = true;
		}
		if (this.data.serie_id != this.data_ori.serie_id) {
			this.need_send = true;
		}
		if (this.data.saison_id != this.data_ori.saison_id) {
			this.need_send = true;
		}
		return this.need_send;
	}
	
	ngOnInit() {
		this.id_video = parseInt(this.route.snapshot.paramMap.get('video_id'));
		this.arianeService.setVideo(this.id_video);
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
		//this.groupService.getOrder()
		this.groupService.getData()
			.then(function(response3) {
				for(let iii= 0; iii < response3.length; iii++) {
					self.listGroup.push({value: response3[iii].id, label: response3[iii].name});
					console.log("[" + self.data.data_id + "] Get serie: " + response3[iii].id + ", label:" + response3[iii].name)
				}
			}).catch(function(response3) {
				console.log("get response3 : " + JSON.stringify(response3, null, 2));
			});
		this.videoService.get(this.id_video)
			.then(function(response) {
				console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.data.name = response.name;
				self.data.description = response.description;
				self.data.episode = response.episode;
				self.data.univers_id = response.univers_id;
				self.data.data_id = response.data_id;
				self.data.time = response.time;
				self.data.generated_name = response.generated_name;
				self.onChangeType(response.type_id);
				self.onChangeGroup(response.serie_id);
				self.data.saison_id = response.saison_id;
				self.data_ori = self.data.clone();
				if (response.covers !== undefined && response.covers !== null) {
					for (let iii=0; iii<response.covers.length; iii++) {
						self.data.covers.push(response.covers[iii]);
						self.covers_display.push({
							id:response.covers[iii],
							url:self.videoService.getCoverUrl(response.covers[iii])
							});
					}
				} else {
					self.covers_display = []
				}
				self.updateNeedSend();
				console.log("covers_list : " + JSON.stringify(self.covers_display, null, 2));
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.data = new DataToSend();
				self.covers_display = [];
				self.data_ori = self.data.clone();
				self.updateNeedSend();
			});
	}
	
	onChangeType(_value:any):void {
		console.log("Change requested of type ... " + _value);
		this.data.type_id = _value;
		//this.data.serie_id = null;
		//this.data.saison_id = null;
		//this.listGroup = [{value: undefined, label: '---'}];
		//this.listSaison = [{value: undefined, label: '---'}];
		let self = this;
		this.updateNeedSend();
		/*
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
		*/
	}
	
	onChangeUnivers(_value:any):void {
		this.data.univers_id = _value;
		this.updateNeedSend();
	}
	
	onChangeGroup(_value:any):void {
		this.data.serie_id = _value;
		this.data.saison_id = null;
		this.listSaison = [{value: undefined, label: '---'}];
		let self = this;
		if (this.data.serie_id != undefined) {
			self.groupService.getSaison(this.data.serie_id, ["id", "name"])
				.then(function(response3) {
					for(let iii= 0; iii < response3.length; iii++) {
						self.listSaison.push({value: response3[iii].id, label: "saison " + response3[iii].name});
					}
				}).catch(function(response3) {
					console.log("get response22 : " + JSON.stringify(response3, null, 2));
				});
		}
		this.updateNeedSend();
	}
	onChangeSaison(_value:any):void {
		this.data.saison_id = _value;
		this.updateNeedSend();
	}
	
	onName(_value:any):void {
		this.data.name = _value;
		this.updateNeedSend();
	}
	
	onDescription(_value:any):void {
		if (_value.length == 0) {
			this.data.description = null;
		} else {
			this.data.description = _value;
		}
		this.updateNeedSend();
	}
	onDate(_value:any):void {
		if (_value.value.length > 4) {
			_value.value = this.data.time;
		} else {
			this.data.time = _value.value;
		}
		this.updateNeedSend();
	}
	
	onEpisode(_value:any):void {
		if (_value.value.length > 4) {
			_value.value = this.data.episode;
		} else {
			this.data.episode = parseInt(_value.value, 10);
		}
		this.updateNeedSend();
	}
	
	sendValues():void {
		console.log("send new values....");
		let data = {}
		if (this.data.name != this.data_ori.name) {
			data["name"] = this.data.name;
		}
		if (this.data.description != this.data_ori.description) {
			data["description"] = this.data.description;
		}
		if (this.data.episode != this.data_ori.episode) {
			data["episode"] = this.data.episode;
		}
		if (this.data.time != this.data_ori.time) {
			data["time"] = this.data.time;
		}
		if (this.data.type_id != this.data_ori.type_id) {
			data["type_id"] = this.data.type_id;
		}
		if (this.data.univers_id != this.data_ori.univers_id) {
			data["univers_id"] = this.data.univers_id;
		}
		if (this.data.serie_id != this.data_ori.serie_id) {
			data["serie_id"] = this.data.serie_id;
		}
		if (this.data.saison_id != this.data_ori.saison_id) {
			data["saison_id"] = this.data.saison_id;
		}
		let tmpp = this.data.clone();
		let self = this;
		this.videoService.put(this.id_video, data)
			.then(function(response3) {
				self.data_ori = tmpp;
				self.updateNeedSend();
			}).catch(function(response3) {
				console.log("get response22 : " + JSON.stringify(response3, null, 2));
				self.updateNeedSend();
			});
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
		this.updateNeedSend();
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
	removeCover(_id) {
		console.log("Request remove cover: " + _id);
	}
	removeMedia() {
		console.log("Request remove Media...");
	}
	newSaison() {
		console.log("Request new Saison...");
		this.modalService.open("custom-modal-1");
	}
	newSerie() {
		console.log("Request new Serie...");
		this.modalService.open("custom-modal-2");
	}
	closeModal(_id) {
		this.modalService.close(_id);
	}
	newType() {
		console.log("Request new Type...");
	}
	newUnivers() {
		console.log("Request new Univers...");
	}
}


