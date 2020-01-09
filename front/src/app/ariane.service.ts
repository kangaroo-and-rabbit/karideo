/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Injectable, Output, EventEmitter } from '@angular/core'

import { TypeService } from 'app/type.service';
import { GroupService } from 'app/group.service';
import { SaisonService } from 'app/saison.service';

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
	
	constructor(
	            private typeService: TypeService,
	            private groupService: GroupService,
	            private saisonService: SaisonService) {
		
	}
	
	reset():number {
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
	}
	
	setType(id:number) {
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
	
	setUnivers(id:number, name:string) {
		this.univers_id = id;
		this.univers_name = name;
		this.univers_change.emit(id);
	}
	getUniversId():number {
		return this.univers_id;
	}
	getUniversName():string {
		return this.univers_name;
	}
	
	setGroup(id:number, name:string) {
		this.group_id = id;
		this.group_name = "??--??";
		let self = this;
		this.groupService.get(id)
			.then(function(response) {
				self.group_name = response.name
				self.group_change.emit(self.type_id);
			}).catch(function(response) {
				self.group_change.emit(self.type_id);
			});
	}
	getGroupId():number {
		return this.group_id;
	}
	getGroupName():string {
		return this.group_name;
	}
	
	setSaison(id:number) {
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
}