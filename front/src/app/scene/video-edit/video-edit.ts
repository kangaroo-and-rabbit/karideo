/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { fadeInAnimation } from '../../_animations/index';
import { HttpWrapperService } from '../../service/http-wrapper';


import { PopInService } from '../../service/popin';
import { TypeService } from '../../service/type';
import { UniverseService } from '../../service/universe';
import { SeriesService } from '../../service/series';
import { SeasonService } from '../../service/season';
import { VideoService } from '../../service/video';
import { DataService } from '../../service/data';
import { ArianeService } from '../../service/ariane';
import { UploadProgress } from '../../popin/upload-progress/upload-progress';

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
	universe_id:number = null
	series_id:number = null
	season_id:number = null
	data_id:number = -1
	time:number = undefined
	type_id:number = null
	covers:Array<any> = [];
	generated_name:string = ""
	clone() {
		let tmp = new DataToSend();
		tmp.name = this.name
		tmp.description = this.description
		tmp.episode = this.episode
		tmp.universe_id = this.universe_id
		tmp.series_id = this.series_id
		tmp.season_id = this.season_id
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

export class VideoEditScene implements OnInit {
	id_video:number = -1;
	mediaIsRemoved:boolean = false
	mediaIsNotFound:boolean = false
	mediaIsLoading:boolean = true
	
	error:string = ""
	
	data:DataToSend = new DataToSend();
	data_ori:DataToSend = new DataToSend();
	coverFile:File;
	upload_file_value:string = ""
	selectedFiles:FileList;
	need_send:boolean = false;
	

	// section tha define the upload value to display in the pop-in of upload 
	upload:UploadProgress = new UploadProgress();
	// ---------------  confirm section  ------------------ 
	public confirmDeleteComment:string = null;
	public confirmDeleteImageUrl:string = null;
	private deleteCoverId:number = null;
	private deleteMediaId:number = null;
	deleteConfirmed() {
		if (this.deleteCoverId !== null) {
			this.removeCoverAfterConfirm(this.deleteCoverId);
			this.cleanConfirm();
		}
		if (this.deleteMediaId !== null) {
			this.removeMediaAfterConfirm(this.deleteMediaId);
			this.cleanConfirm();
		}
	}
	cleanConfirm() {
		this.confirmDeleteComment = null;
		this.confirmDeleteImageUrl = null;
		this.deleteCoverId = null;
		this.deleteMediaId = null;
	}

	covers_display:Array<any> = [];
	
	listType: ElementList[] = [
		{value: undefined, label: '---'},
	];
	listUniverse: ElementList[] = [
		{value: undefined, label: '---'},
		{value: null, label: '---'},
	];
	listSeries: ElementList[] = [
		{value: undefined, label: '---'},
	];
	listSeason: ElementList[] = [
		{value: undefined, label: '---'},
	];
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private dataService: DataService,
	            private typeService: TypeService,
	            private universeService: UniverseService,
	            private seriesService: SeriesService,
	            private seasonService: SeasonService,
	            private videoService: VideoService,
	            private httpService: HttpWrapperService,
	            private arianeService: ArianeService,
	            private popInService: PopInService) {
		
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
		if (this.data.universe_id != this.data_ori.universe_id) {
			this.need_send = true;
		}
		if (this.data.series_id != this.data_ori.series_id) {
			this.need_send = true;
		}
		if (this.data.season_id != this.data_ori.season_id) {
			this.need_send = true;
		}
		return this.need_send;
	}

	updateCoverList(_covers: any) {
		this.covers_display = [];
		this.data.covers = [];
		if (_covers !== undefined && _covers !== null) {
			for (let iii=0; iii<_covers.length; iii++) {
				this.data.covers.push(_covers[iii]);
				this.covers_display.push({
					id:_covers[iii],
					url:this.videoService.getCoverThumbnailUrl(_covers[iii])
					});
			}
		} else {
			this.covers_display = []
		}
	}
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		this.id_video = this.arianeService.getVideoId();
		let self = this;
		this.listType = [{value: null, label: '---'}];
		this.listUniverse = [{value: null, label: '---'}];
		this.listSeries = [{value: null, label: '---'}];
		this.listSeason = [{value: null, label: '---'}];
		this.universeService.getData()
			.then(function(response2) {
				for(let iii= 0; iii < response2.length; iii++) {
					self.listUniverse.push({value: response2[iii].id, label: response2[iii].name});
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
		//this.seriesService.getOrder()
		this.seriesService.getData()
			.then(function(response3) {
				for(let iii= 0; iii < response3.length; iii++) {
					self.listSeries.push({value: response3[iii].id, label: response3[iii].name});
					console.log("[" + self.data.data_id + "] Get series: " + response3[iii].id + ", label:" + response3[iii].name)
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
				self.data.universe_id = response.univers_id;
				if (self.data.universe_id === undefined) {
					self.data.universe_id = null;
				}
				self.data.data_id = response.data_id;
				self.data.time = response.time;
				self.data.generated_name = response.generated_name;
				self.onChangeType(response.type_id);
				self.onChangeSeries(response.series_id);
				self.data.season_id = response.season_id;
				if (self.data.season_id === undefined) {
					self.data.season_id = null;
				}
				self.data_ori = self.data.clone();
				self.updateCoverList(response.covers);
				self.updateNeedSend();
				console.log("covers_list : " + JSON.stringify(self.covers_display, null, 2));
				self.mediaIsLoading = false;
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.data = new DataToSend();
				self.covers_display = [];
				self.data_ori = self.data.clone();
				self.updateNeedSend();
				self.mediaIsNotFound = true;
				self.mediaIsLoading = false;
			});
	}
	
	onChangeType(_value:any):void {
		console.log("Change requested of type ... " + _value);
		this.data.type_id = _value;
		if (this.data.type_id == undefined) {
			this.data.type_id = null;
		}
		//this.data.series_id = null;
		//this.data.season_id = null;
		//this.listSeries = [{value: undefined, label: '---'}];
		//this.listSeason = [{value: undefined, label: '---'}];
		let self = this;
		this.updateNeedSend();
		/*
		if (this.type_id != undefined) {
			self.typeService.getSubSeries(this.type_id, ["id", "name"])
				.then(function(response2) {
					for(let iii= 0; iii < response2.length; iii++) {
						self.listSeries.push({value: response2[iii].id, label: response2[iii].name});
					}
				}).catch(function(response2) {
					console.log("get response22 : " + JSON.stringify(response2, null, 2));
				});
		}
		*/
	}
	
	onChangeUniverse(_value:any):void {
		this.data.universe_id = _value;
		this.updateNeedSend();
	}
	
	onChangeSeries(_value:any):void {
		this.data.series_id = _value;
		if (this.data.series_id === undefined) {
			this.data.series_id = null;
		}
		this.data.season_id = null;
		this.listSeason = [{value: undefined, label: '---'}];
		let self = this;
		if (this.data.series_id != undefined) {
			self.seriesService.getSeason(this.data.series_id, ["id", "name"])
				.then(function(response3) {
					for(let iii= 0; iii < response3.length; iii++) {
						self.listSeason.push({value: response3[iii].id, label: "season " + response3[iii].name});
					}
				}).catch(function(response3) {
					console.log("get response22 : " + JSON.stringify(response3, null, 2));
				});
		}
		this.updateNeedSend();
	}
	onChangeSeason(_value:any):void {
		this.data.season_id = _value;
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
		if (this.data.time < 10) {
			this.data.time = null;
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
			if (this.data.description == undefined) {
				data["description"] = null;
			} else {
				data["description"] = this.data.description;
			}
		}
		if (this.data.episode != this.data_ori.episode) {
			data["episode"] = this.data.episode;
		}
		if (this.data.time != this.data_ori.time) {
			data["time"] = this.data.time;
		}
		if (this.data.type_id != this.data_ori.type_id) {
			if (this.data.type_id == undefined) {
				data["type_id"] = null;
			} else {
				data["type_id"] = this.data.type_id;
			}
		}
		if (this.data.universe_id != this.data_ori.universe_id) {
			if (this.data.universe_id == undefined) {
				data["universe_id"] = null;
			} else {
				data["universe_id"] = this.data.universe_id;
			}
		}
		if (this.data.series_id != this.data_ori.series_id) {
			if (this.data.series_id == undefined) {
				data["series_id"] = null;
			} else {
				data["series_id"] = this.data.series_id;
			}
		}
		if (this.data.season_id != this.data_ori.season_id) {
			if (this.data.season_id == undefined) {
				data["season_id"] = null;
			} else {
				data["season_id"] = this.data.season_id;
			}
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
		//TODO : this.uploadFile(_event.dataTransfer.files[0]);
		console.log("error in drag & drop ...");
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
		this.uploadCover(this.coverFile);
		this.updateNeedSend();
	}
	
	uploadCover(_file:File) {
		if (_file == undefined) {
			console.log("No file selected!");
			return;
		}
		let self = this;
		// clean upload labels*
		this.upload.clear();
		// display the upload pop-in
		this.popInService.open("popin-upload-progress");
		this.videoService.uploadCover(_file, this.id_video, function(count, total) {
	    	self.upload.mediaSendSize = count;
	    	self.upload.mediaSize = total;
	    })
		.then(function (response:any) {
			console.log("get response of cover : " + JSON.stringify(response, null, 2));
			self.upload.result = "Cover added done";
			// TODO: we retrive the whiole media ==> update data ...
			self.updateCoverList(response.covers);
		}).catch(function (response:any) {
			//self.error = "Can not get the data";
			console.log("Can not add the cover in the video...");
			self.upload.error = "Error in the upload of the cover..." + JSON.stringify(response, null, 2);
		});
	}

	removeCover(_id:number) {
		this.cleanConfirm();
		this.confirmDeleteComment = "Delete the cover ID: " + _id; 
		this.confirmDeleteImageUrl = this.seriesService.getCoverThumbnailUrl(_id);
		this.deleteCoverId = _id;
		this.popInService.open("popin-delete-confirm");
	}
	removeCoverAfterConfirm(_id:number) {
		console.log("Request remove cover: " + _id);
		let self = this;
		this.videoService.deleteCover(this.id_video, _id)
			.then(function (response:any) {
				console.log("get response of remove cover : " + JSON.stringify(response, null, 2));
				self.upload.result = "Cover remove done";
				// TODO: we retrive the whiole media ==> update data ...
				self.updateCoverList(response.covers);
			}).catch(function (response:any) {
				//self.error = "Can not get the data";
				console.log("Can not remove the cover of the video...");
				self.upload.error = "Error in the upload of the cover..." + JSON.stringify(response, null, 2);
			});
	}
	removeMedia() {
		console.log("Request remove Media...");
		this.cleanConfirm();
		this.confirmDeleteComment = "Delete the Media: " + this.id_video; 
		this.deleteMediaId = this.id_video;
		this.popInService.open("popin-delete-confirm");
	}
	removeMediaAfterConfirm(_id:number) {
		let self = this;
		this.videoService.delete(_id)
			.then(function(response3) {
				//self.data_ori = tmpp;
				//self.updateNeedSend();
				self.mediaIsRemoved = true;
			}).catch(function(response3) {
				//self.updateNeedSend();
			});
	}
	
	eventPopUpSeason(_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-new-season");
	}
	eventPopUpSeries(_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-new-series");
	}
	eventPopUpType(_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-new-type");
	}
	eventPopUpUniverse(_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-new-universe");
	}
	
	newSeason(): void {
		console.log("Request new Season...");
		this.popInService.open("popin-new-season");
	}
	newSeries(): void {
		console.log("Request new Series...");
		this.popInService.open("popin-new-series");
	}
	newType(): void {
		console.log("Request new Type...");
		this.popInService.open("popin-create-type");
	}
	newUniverse() {
		console.log("Request new Universe...");
		this.popInService.open("popin-new-universe");
	}
}


