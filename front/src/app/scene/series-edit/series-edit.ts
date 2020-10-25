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

import { SeriesService } from '../../service/series';
import { DataService } from '../../service/data';
import { ArianeService } from '../../service/ariane';
import { UploadProgress } from '../../popin/upload-progress/upload-progress';
import { PopInService } from '../../service/popin';

export class ElementList {
	value: number;
	label: string;
	constructor(_value: number, _label: string) {
		this.value = _value;
		this.label = _label;
	}
}

@Component({
	selector: 'app-series-edit',
	templateUrl: './series-edit.html',
	styleUrls: ['./series-edit.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
// https://www.sitepoint.com/angular-forms/
export class SeriesEditScene implements OnInit {
	id_series:number = -1;
	
	error:string = ""
	
	name:string = ""
	description:string = ""
	coverFile:File;
	upload_file_value:string = ""
	selectedFiles:FileList;
	
	covers_display:Array<any> = [];
	// section tha define the upload value to display in the pop-in of upload 
	public upload:UploadProgress = new UploadProgress();

	// ---------------  confirm section  ------------------ 
	public confirmDeleteComment:string = null;
	public confirmDeleteImageUrl:string = null;
	private deleteCoverId:number = null;
	deleteConfirmed() {
		if (this.deleteCoverId !== null) {
			this.removeCoverAfterConfirm(this.deleteCoverId);
			this.cleanConfirm();
		}
	}
	cleanConfirm() {
		this.confirmDeleteComment = null;
		this.confirmDeleteImageUrl = null;
		this.deleteCoverId = null;
	}
	
	
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private dataService: DataService,
	            private seriesService: SeriesService,
	            private arianeService: ArianeService,
	            private popInService: PopInService) {
		
	}
	
	ngOnInit() {
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		this.id_series = this.arianeService.getSeriesId();
		let self = this;
		this.seriesService.get(this.id_series)
			.then(function(response) {
				//console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.name = response.name;
				self.description = response.description;
				self.updateCoverList(response.covers);
				//console.log("covers_list : " + JSON.stringify(self.covers_display, null, 2));
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = "";
				self.description = "";
				self.covers_display = [];
			});
	}

	updateCoverList(_covers: any) {
		this.covers_display = [];
		if (_covers !== undefined && _covers !== null) {
			for (let iii=0; iii<_covers.length; iii++) {
				this.covers_display.push({
					id:_covers[iii],
					url:this.seriesService.getCoverThumbnailUrl(_covers[iii])
					});
			}
		} else {
			this.covers_display = []
		}
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
		if (this.description === undefined) {
			data["description"] = null;
		}
		this.seriesService.put(this.id_series, data);
	}
	
	// At the drag drop area
	// (drop)="onDropFile($event)"
	onDropFile(_event: DragEvent) {
		_event.preventDefault();
		//this.uploadFile(_event.dataTransfer.files[0]);
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
	}
	
	uploadCover(_file:File) {
		if (_file == undefined) {
			console.log("No file selected!");
			return;
		}
		let self = this;
		// clean upload labels
		this.upload.clear();
		// display the upload pop-in
		this.popInService.open("popin-upload-progress");
		this.seriesService.uploadCover(_file, this.id_series, function(count, total) {
		    	self.upload.mediaSendSize = count;
		    	self.upload.mediaSize = total;
		    })
			.then(function (response:any) {
				self.upload.result = "Cover added done";
				// TODO: we retrive the whiole media ==> update data ...
				self.updateCoverList(response.covers);
			}).catch(function (response:any) {
				//self.error = "Can not get the data";
				console.log("Can not add the cover in the video...");
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
		this.seriesService.deleteCover(this.id_series, _id)
			.then(function (response:any) {
				self.upload.result = "Cover remove done";
				// TODO: we retrive the whiole media ==> update data ...
				self.updateCoverList(response.covers);
			}).catch(function (response:any) {
				//self.error = "Can not get the data";
				console.log("Can not remove the cover of the video...");
			});
	}

}