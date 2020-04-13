/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Injectable, Output, EventEmitter, OnInit} from '@angular/core'

import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';

import { TypeService } from 'app/service/type';
import { UniversService } from 'app/service/univers';
import { GroupService } from 'app/service/group';
import { SaisonService } from 'app/service/saison';
import { VideoService } from 'app/service/video';
import { environment } from 'environments/environment';

export class InputOrders {
	public type_id: number = null;
	public univers_id: number = null;
	public group_id: number = null;
	public saison_id: number = null;
	public video_id: number = null;
}

@Injectable()
export class ArianeService {
	
	
	public type_id: number = null;
	public type_name: string = null;
	@Output() type_change: EventEmitter<number> = new EventEmitter();
	
	public univers_id: number = null;
	public univers_name: string = null;
	@Output() univers_change: EventEmitter<number> = new EventEmitter();
	
	public group_id: number = null;
	public group_name: string = null;
	@Output() group_change: EventEmitter<number> = new EventEmitter();
	
	public saison_id: number = null;
	public saison_name: string = null;
	@Output() saison_change: EventEmitter<number> = new EventEmitter();
	
	public video_id: number = null;
	public video_name: string = null;
	@Output() video_change: EventEmitter<number> = new EventEmitter();
	
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private typeService: TypeService,
	            private universService: UniversService,
	            private groupService: GroupService,
	            private saisonService: SaisonService,
	            private videoService: VideoService) {
		console.log("Start ArianeService");
	}
	updateParams(params) {
		console.log("sparams " + params);
		console.log("sparams['type_id'] " + params['type_id']);
		if(params['type_id']) {
			this.setType(params['type_id'])
		} else {
			this.setType(null);
		}
	}
	
	updateManual(params) {
		let type_id = params.get('type_id');
		if (type_id === null || type_id === undefined || type_id == "null" || type_id == "NULL" || type_id == "") {
			type_id = null;
		} else {
			type_id = parseInt(type_id)
		}
		console.log("type_id = " + type_id + "      " + params.get('type_id'));
		
		let univers_id = params.get('univers_id');
		if (univers_id === null || univers_id === undefined || univers_id == "null" || univers_id == "NULL" || univers_id == "") {
			univers_id = null;
		} else {
			univers_id = parseInt(univers_id)
		}
		console.log("univers_id = " + univers_id + "      " + params.get('univers_id'));
		
		let group_id = params.get('group_id');
		if (group_id === null || group_id === undefined || group_id == "null" || group_id == "NULL" || group_id == "") {
			group_id = null;
		} else {
			group_id = parseInt(group_id)
		}
		console.log("group_id = " + group_id + "      " + params.get('group_id'));
		
		let saison_id = params.get('saison_id');
		if (saison_id === null || saison_id === undefined || saison_id == "null" || saison_id == "NULL" || saison_id == "") {
			saison_id = null;
		} else {
			saison_id = parseInt(saison_id)
		}
		console.log("saison_id = " + saison_id + "      " + params.get('saison_id'));
		
		let video_id = params.get('video_id');
		if (video_id === null || video_id === undefined || video_id == "null" || video_id == "NULL" || video_id == "") {
			video_id = null;
		} else {
			video_id = parseInt(video_id)
		}
		console.log("video_id = " + video_id + "      " + params.get('video_id'));
		
		this.setType(type_id);
		this.setUnivers(univers_id);
		this.setGroup(group_id);
		this.setSaison(saison_id);
		this.setVideo(video_id);
	}
	reset():void {
		this.type_id = null;
		this.type_name = null;
		this.type_change.emit(this.type_id);
		this.univers_id = null;
		this.univers_name = null;
		this.univers_change.emit(this.univers_id);
		this.group_id = null;
		this.group_name = null;
		this.group_change.emit(this.group_id);
		this.saison_id = null;
		this.saison_name = null;
		this.saison_change.emit(this.saison_id);
		this.video_id = null;
		this.video_name = null;
		this.video_change.emit(this.video_id);
	}
	/*
	getCurrentRoute():InputOrders {
		let out = new InputOrders()
		out.type_id = parseInt(this.route.snapshot.paramMap.get('type_id'));
		if (out.type_id == 0){
			out.type_id = undefined;
		}
		out.univers_id = parseInt(this.route.snapshot.paramMap.get('univers_id'));
		if (out.univers_id == 0){
			out.univers_id = undefined;
		}
		out.group_id = parseInt(this.route.snapshot.paramMap.get('group_id'));
		if (out.group_id == 0){
			out.group_id = undefined;
		}
		out.saison_id = parseInt(this.route.snapshot.paramMap.get('saison_id'));
		if (out.saison_id == 0){
			out.saison_id = undefined;
		}
		out.video_id = parseInt(this.route.snapshot.paramMap.get('video_id'));
		if (out.video_id == 0){
			out.video_id = undefined;
		}
		return out;
	}
	
	routeTo(_data:InputOrders, _destination:string = null) {
		routeTo = ""
		//if (
		this.router.navigate(['/type/' + this.type_id + '/group/' + this.id_group + '/saison/' + _idSelected ]);
	}
	*/
	
	setType(_id:number):void {
		if (this.type_id == _id) {
			return;
		}
		if (_id === undefined) {
			return;
		}
		this.type_id = _id;
		this.type_name = "??--??";
		if (this.type_id === null) {
			this.type_change.emit(this.type_id);
			return;
		}
		let self = this;
		this.typeService.get(_id)
			.then(function(response) {
				self.type_name = response.name
				self.type_change.emit(self.type_id);
			}).catch(function(response) {
				self.type_change.emit(self.type_id);
			});
	}
	getTypeId():number {
		return this.type_id;
	}
	getTypeName():string {
		return this.type_name;
	}
	
	setUnivers(_id:number) {
		if (this.univers_id == _id) {
			return;
		}
		if (_id === undefined) {
			return;
		}
		this.univers_id = _id;
		this.univers_name = "??--??";
		if (this.univers_id === null) {
			this.univers_change.emit(this.univers_id);
			return;
		}
		let self = this;
		this.universService.get(_id)
			.then(function(response) {
				self.univers_name = response.number
				self.univers_change.emit(self.univers_id);
			}).catch(function(response) {
				self.univers_change.emit(self.univers_id);
			});
	}
	getUniversId():number {
		return this.univers_id;
	}
	getUniversName():string {
		return this.univers_name;
	}
	
	setGroup(_id:number):void {
		if (this.group_id == _id) {
			return;
		}
		if (_id === undefined) {
			return;
		}
		this.group_id = _id;
		this.group_name = "??--??";
		if (this.group_id === null) {
			this.group_change.emit(this.group_id);
			return;
		}
		let self = this;
		this.groupService.get(_id)
			.then(function(response) {
				self.group_name = response.name
				self.group_change.emit(self.group_id);
			}).catch(function(response) {
				self.group_change.emit(self.group_id);
			});
	}
	getGroupId():number {
		return this.group_id;
	}
	getGroupName():string {
		return this.group_name;
	}
	
	setSaison(_id:number):void {
		if (this.saison_id == _id) {
			return;
		}
		if (_id === undefined) {
			return;
		}
		this.saison_id = _id;
		this.saison_name = "??--??";
		if (this.saison_id === null) {
			this.saison_change.emit(this.saison_id);
			return;
		}
		let self = this;
		this.saisonService.get(_id)
			.then(function(response) {
				//self.setGroup(response.group_id);
				self.saison_name = response.name
				self.saison_change.emit(self.saison_id);
			}).catch(function(response) {
				self.saison_change.emit(self.saison_id);
			});
	}
	getSaisonId():number {
		return this.saison_id;
	}
	getSaisonName():string {
		return this.saison_name;
	}
	
	setVideo(_id:number):void {
		if (this.video_id == _id) {
			return;
		}
		if (_id === undefined) {
			return;
		}
		this.video_id = _id;
		this.video_name = "??--??";
		if (this.video_id === null) {
			this.video_change.emit(this.video_id);
			return;
		}
		let self = this;
		this.videoService.get(_id)
			.then(function(response) {
				//self.setSaison(response.saison_id);
				//self.setGroup(response.group_id);
				self.video_name = response.name;
				self.video_change.emit(self.video_id);
			}).catch(function(response) {
				self.video_change.emit(self.video_id);
			});
	}
	getVideoId():number {
		return this.video_id;
	}
	getVideoName():string {
		return this.video_name;
	}
	
	genericNavigate(_destination:string, _universId:number, _typeId:number, _groupId:number, _saisonId:number, _videoId:number, _newWindows:boolean):void {
		let addressOffset = _destination + '/' + _universId + '/' + _typeId + '/' + _groupId + '/' + _saisonId + '/' + _videoId;
		if(_newWindows==true) {
			if (environment.frontBaseUrl === undefined || environment.frontBaseUrl === null || environment.frontBaseUrl === "") {
				window.open('/' + addressOffset);
			} else {
				window.open("/" + environment.frontBaseUrl + '/' + addressOffset);
			}
		} else {
			this.router.navigate([addressOffset]);
		}
	}

	navigateUnivers(_id:number, _newWindows:boolean):void {
		this.genericNavigate('univers', _id, this.type_id, null, null, null, _newWindows);
	}
	navigateUniversEdit(_id:number, _newWindows:boolean):void {
		this.genericNavigate('univers-edit', _id, this.type_id, null, null, null, _newWindows);
	}
	navigateType(_id:number, _newWindows:boolean):void {
		this.genericNavigate('type', this.univers_id, _id, null, null, null, _newWindows);
	}
	navigateTypeEdit(_id:number, _newWindows:boolean):void {
		this.genericNavigate('type-edit', this.univers_id, _id, null, null, null, _newWindows);
	}
	navigateGroup(_id:number, _newWindows:boolean):void {
		this.genericNavigate('group', this.univers_id, this.type_id, _id, null, null, _newWindows);
	}
	navigateGroupEdit(_id:number, _newWindows:boolean):void {
		this.genericNavigate('group-edit', this.univers_id, this.type_id, _id, null, null, _newWindows);
	}
	navigateSaison(_id:number, _newWindows:boolean):void {
		this.genericNavigate('saison', this.univers_id, this.type_id, this.group_id, _id, null, _newWindows);
	}
	navigateSaisonEdit(_id:number, _newWindows:boolean):void {
		this.genericNavigate('saison-edit', this.univers_id, this.type_id, this.group_id, _id, null, _newWindows);
	}
	navigateVideo(_id:number, _newWindows:boolean):void {
		this.genericNavigate('video', this.univers_id, this.type_id, this.group_id, this.saison_id, _id, _newWindows);
	}
	navigateVideoEdit(_id:number, _newWindows:boolean):void {
		this.genericNavigate('video-edit', this.univers_id, this.type_id, this.group_id, this.saison_id, _id, _newWindows);
	}


}