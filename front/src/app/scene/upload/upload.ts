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
import { HttpWrapperService } from '../../service/http-wrapper';
import { HttpEventType, HttpResponse } from '@angular/common/http';


import { PopInService } from '../../service/popin';
import { TypeService } from '../../service/type';
import { UniverseService } from '../../service/universe';
import { SeriesService } from '../../service/series';
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


@Component({
	selector: 'app-video-edit',
	templateUrl: './upload.html',
	styleUrls: ['./upload.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
// https://www.sitepoint.com/angular-forms/
export class UploadScene implements OnInit {
	id_video: number = -1;

	error: string = "";

	mediaFile: File = null;
	upload_file_value: string = ""
	selectedFiles: FileList;
	type_id: number = undefined
	series_id: number = undefined
	need_send: boolean = false;

	covers_display: Array<any> = [];

	// section tha define the upload value to display in the pop-in of upload 
	public upload:UploadProgress = new UploadProgress();

	

	listType: ElementList[] = [
		{ value: undefined, label: '---' },
	];
	listUniverse: ElementList[] = [
		{ value: undefined, label: '---' },
		{ value: null, label: '---' },
	];
	listSeries: ElementList[] = [
		{ value: undefined, label: '---' },
	];
	listSeries2 = [{ id: undefined, description: '---' }];
	/*
	  config = {
			    displayKey: "label", // if objects array passed which key to be displayed defaults to description
			    search: true,
			    limitTo: 3,
			  };
	  */
	config = {
		displayKey: "description", //if objects array passed which key to be displayed defaults to description
		search: true, //true/false for the search functionlity defaults to false,
		height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
		placeholder: 'Select', // text to be displayed when no item is selected defaults to Select,
		customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
		limitTo: 10, // number thats limits the no of options displayed in the UI (if zero, options will not be limited)
		moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
		noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
		searchPlaceholder: 'Search', // label thats displayed in search input,
		searchOnKey: 'description', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
	}
	listSeason: ElementList[] = [
		{ value: undefined, label: '---' },
	];
	parse_universe: string = "";
	parse_series: string = "";
	parse_season: number = null;
	parse_episode: number = null;
	parse_title: string = "";
	constructor(private route: ActivatedRoute,
		private router: Router,
		private locate: Location,
		private dataService: DataService,
		private typeService: TypeService,
		private universeService: UniverseService,
		private seriesService: SeriesService,
		private videoService: VideoService,
		private httpService: HttpWrapperService,
		private arianeService: ArianeService,
		private popInService: PopInService) {

	}

	updateNeedSend (): boolean {
		if (this.mediaFile == null) {
			this.need_send = false;
			return;
		}
		this.need_send = true;
		if (this.parse_title === undefined || this.parse_title === null || this.parse_title === "") {
			this.need_send = false;
		}
		if (this.type_id === undefined) {
			this.need_send = false;
		}
		return this.need_send;
	}

	ngOnInit () {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		this.id_video = this.arianeService.getVideoId();
		let self = this;
		this.listType = [{ value: undefined, label: '---' }];
		this.listUniverse = [{ value: undefined, label: '---' }];
		this.listSeries = [{ value: undefined, label: '---' }];
		this.listSeason = [{ value: undefined, label: '---' }];
		this.universeService.getData()
			.then(function (response2) {
				for (let iii = 0; iii < response2.length; iii++) {
					self.listUniverse.push({ value: response2[iii].id, label: response2[iii].name });
				}
			}).catch(function (response2) {
				console.log("get response22 : " + JSON.stringify(response2, null, 2));
			});
		this.typeService.getData()
			.then(function (response2) {
				for (let iii = 0; iii < response2.length; iii++) {
					self.listType.push({ value: response2[iii].id, label: response2[iii].name });
				}
			}).catch(function (response2) {
				console.log("get response22 : " + JSON.stringify(response2, null, 2));
			});
		//this.seriesService.getOrder()
		this.seriesService.getData()
			.then(function (response3) {
				for (let iii = 0; iii < response3.length; iii++) {
					self.listSeries.push({ value: response3[iii].id, label: response3[iii].name });
					//console.log("Get series: " + response3[iii].id + ", label:" + response3[iii].name)
				}
			}).catch(function (response3) {
				console.log("get response3 : " + JSON.stringify(response3, null, 2));
			});
			/*
		this.videoService.get(this.id_video)
			.then(function (response) {
				console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.data.name = response.name;
				self.data.description = response.description;
				self.data.episode = response.episode;
				self.data.universe_id = response.univers_id;
				self.data.data_id = response.data_id;
				self.data.time = response.time;
				self.data.generated_name = response.generated_name;
				self.onChangeType(response.type_id);
				self.onChangeSeries(response.series_id);
				self.data.season_id = response.season_id;
				self.data_ori = self.data.clone();
				if (response.covers !== undefined && response.covers !== null) {
					for (let iii = 0; iii < response.covers.length; iii++) {
						self.data.covers.push(response.covers[iii]);
						self.covers_display.push({
							id: response.covers[iii],
							url: self.videoService.getCoverUrl(response.covers[iii])
						});
					}
				} else {
					self.covers_display = []
				}
				self.updateNeedSend();
				console.log("covers_list : " + JSON.stringify(self.covers_display, null, 2));
			}).catch(function (response) {
				self.error = "Can not get the data";
				self.data = new DataToSend();
				self.covers_display = [];
				self.data_ori = self.data.clone();
				self.updateNeedSend();
			});
			*/
			console.log(" END INIT ");
	}

	onChangeType (_value: any): void {
		console.log("Change requested of type ... " + _value);
		this.type_id = _value;
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

	onChangeSeries (_value: any): void {
		this.series_id = _value;
		if (_value === undefined || _value === null) {
			
		} else {
			for (let iii = 0 ; iii<this.listSeries.length ; iii++) {
				if (this.listSeries[iii].value == _value) {
					this.parse_series = this.listSeries[iii].label;
					break;
				}
			}
		}
		this.updateNeedSend();
	}
	onSeason (_value: any): void {
		this.parse_season = _value;
		this.updateNeedSend();
	}

	onTitle (_value: any): void {
		this.parse_title = _value;
		this.updateNeedSend();
	}

	onUniverse (_value: any): void {
		this.parse_universe = _value;
		this.updateNeedSend();
	}

	onEpisode (_value: any): void {
		this.parse_episode = parseInt(_value.value, 10);
		this.updateNeedSend();
	}
	onSeries (_value: any): void {
		this.parse_series = _value;
		let self = this;
		if (this.parse_series != "") {
			this.seriesService.getLike(this.parse_series)
					.then(function(response) {
						console.log("find elemet: " + response.name + "  " + response.id);
						self.series_id = response.id;
					}).catch(function(response) {
						console.log("CAN NOT find element: " );
						self.series_id = null;
					});
		}
		this.updateNeedSend();
	}
	
	sendFile(): void {
		console.log("Send file requested ... " + this.mediaFile);
		this.uploadFile(this.mediaFile);
	}

	// At the drag drop area
	// (drop)="onDropFile($event)"
	onDropFile (_event: DragEvent) {
		_event.preventDefault();
		this.uploadFile(_event.dataTransfer.files[0]);
	}

	// At the drag drop area
	// (dragover)="onDragOverFile($event)"
	onDragOverFile (_event) {
		_event.stopPropagation();
		_event.preventDefault();
	}

	// At the file input element
	// (change)="selectFile($event)"
	onChangeFile (_value: any): void {
		this.parse_universe = "";
		this.parse_series = "";
		this.parse_season = null;
		this.parse_episode = null;
		this.parse_title = "";
		this.selectedFiles = _value.files
		this.mediaFile = this.selectedFiles[0];
		console.log("select file " + this.mediaFile.name);
		const splitElement = this.mediaFile.name.split('-');
		if (splitElement.length == 1) {
			this.parse_title = splitElement[0];
		} else {
			if (splitElement.length>=2) {
				this.parse_series = splitElement[0];
			}
			splitElement.splice(0,1);
			if (splitElement.length == 1) {
				this.parse_title = splitElement[0];
			} else {
				while (splitElement.length>0) {
					let element = splitElement[0];
					let find = false;
					if (this.parse_season == null) {
						if (element.length >= 1 && (element[0] == 's' || element[0] == 'S') ) {
							element = element.substring(1);
							this.parse_season = parseInt(element, 10);
							find = true;
						}
					}
					if (this.parse_episode == null && find == false) {
						if (element.length >= 1 && (element[0] == 'e' || element[0] == 'E') ) {
							element = element.substring(1);
							this.parse_episode = parseInt(element, 10);
							find = true;
						}
					}
					if (find == false) {
						if (this.parse_season == null && this.parse_episode == null) {
							if (this.parse_universe == "") {
								this.parse_universe = element;
							} else {
								this.parse_universe = this.parse_universe + "-" + element;
							}
						} else {
							if (this.parse_title == "") {
								this.parse_title = element;
							} else {
								this.parse_title = this.parse_title + "-" + element;
							}
						}
					}
					splitElement.splice(0,1);
				}
			}
		}
		// remove extention
		this.parse_title = this.parse_title.replace(new RegExp("\.(mkv|MKV|Mkv|webm|WEBM|Webm)"),"");
		//this.uploadFile(this.coverFile);
		this.updateNeedSend();
		
		let self = this;
		if (this.parse_series != "") {
			this.seriesService.getLike(this.parse_series)
					.then(function(response) {
						console.log("find elemet: " + response.name + "  " + response.id);
						self.series_id = response.id;
					}).catch(function(response) {
						console.log("CAN NOT find element: " );
					});
		}
		
		
	}

	uploadFile (_file: File) {
		if (_file == undefined) {
			console.log("No file selected!");
			return;
		}
		let self = this;

		/*
		this.parse_series = "";
		this.parse_season = null;
		this.parse_episode = null;
		this.parse_title = "";
		*/
		this.upload = new UploadProgress();
		// add universe
		if (this.parse_universe != null) {
			this.upload.labelMediaTitle += this.parse_universe;
		}
		// add series
		if (this.parse_series != null) {
			if (this.upload.labelMediaTitle.length != 0) {
				this.upload.labelMediaTitle += "/";
			}
			this.upload.labelMediaTitle += this.parse_series;
		}
		// add season
		if (this.parse_season != null) {
			if (this.upload.labelMediaTitle.length != 0) {
				this.upload.labelMediaTitle += "-";
			}
			this.upload.labelMediaTitle += "s" + this.parse_season.toString();
		}
		// add episode ID
		if (this.parse_episode != null) {
			if (this.upload.labelMediaTitle.length != 0) {
				this.upload.labelMediaTitle += "-";
			}
			this.upload.labelMediaTitle += "e" + this.parse_episode.toString();
		}
		// add title
		if (this.upload.labelMediaTitle.length != 0) {
			this.upload.labelMediaTitle += "-";
		}
		this.upload.labelMediaTitle += this.parse_title;
		// display the upload pop-in
		this.popInService.open("popin-upload-progress");
		this.videoService.uploadFile(_file,
				this.parse_universe,
				this.parse_series,
				this.parse_season,
				this.parse_episode,
				this.parse_title,
				this.type_id,
				function(count, total) {
	    	//console.log("upload : " + count*100/total);
	    	self.upload.mediaSendSize = count;
	    	self.upload.mediaSize = total;
	    	
	    })
		.then(function (response) {
			console.log("get response of video : " + JSON.stringify(response, null, 2));
			self.upload.result = "Media creation done";
		}).catch(function (response) {
			//self.error = "Can not get the data";
			console.log("Can not add the data in the system...");
			self.upload.error = "Error in the upload of the data..." + JSON.stringify(response, null, 2);
		});
	}
	removeCover (_id) {
		console.log("Request remove cover: " + _id);
	}
	removeMedia () {
		console.log("Request remove Media...");
		this.videoService.delete(this.id_video)
			.then(function (response3) {
				//self.data_ori = tmpp;
				//self.updateNeedSend();
			}).catch(function (response3) {

				//self.updateNeedSend();
			});
	}

	eventPopUpSeason (_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-new-season");
	}
	eventPopUpSeries (_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-new-series");
	}
	eventPopUpType (_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-new-type");
	}
	eventPopUpUniverse (_event: string): void {
		console.log("GET event: " + _event);
		this.popInService.close("popin-new-universe");
	}

	newSeason (): void {
		console.log("Request new Season...");
		this.popInService.open("popin-new-season");
	}
	newSeries (): void {
		console.log("Request new Series...");
		this.popInService.open("popin-new-series");
	}
	newType (): void {
		console.log("Request new Type...");
		this.popInService.open("popin-create-type");
	}
	newUniverse () {
		console.log("Request new Universe...");
		this.popInService.open("popin-new-universe");
	}
}


