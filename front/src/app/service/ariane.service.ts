/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Injectable, Output, EventEmitter } from '@angular/core'

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { TypeService } from 'app/service/type.service';
import { UniversService } from 'app/service/univers.service';
import { GroupService } from 'app/service/group.service';
import { SaisonService } from 'app/service/saison.service';

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
	@Output() video_change: EventEmitter<number> = new EventEmitter();
	
	constructor(private route: ActivatedRoute,
	            private typeService: TypeService,
	            private universService: UniversService,
	            private groupService: GroupService,
	            private saisonService: SaisonService) {
		
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
	
	setType(id:number):void {
		this.type_id = id;
		this.type_name = "??--??";
		let self = this;
		this.typeService.get(id)
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
	
	setUnivers(id:number) {
		this.univers_id = id;
		this.univers_name = "??--??";
		let self = this;
		this.universService.get(id)
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
	
	setGroup(id:number):void {
		this.group_id = id;
		this.group_name = "??--??";
		let self = this;
		this.groupService.get(id)
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
	
	setSaison(id:number):void {
		this.saison_id = id;
		this.saison_name = "??--??";
		let self = this;
		this.saisonService.get(id)
			.then(function(response) {
				self.saison_name = response.number
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
	
	setVideo(id:number):void {
		this.video_id = id;
		this.video_change.emit(this.video_id);
	}
	getVideoId():number {
		return this.video_id;
	}
}