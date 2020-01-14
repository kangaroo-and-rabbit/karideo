import { Injectable } from '@angular/core';
import { HttpWrapperService } from 'app/service/http-wrapper.service';

@Injectable()
export class SaisonService {
	// 0: Not hide password; 1 hide password;
	private identificationVersion: number = 1;
	
	constructor(private http: HttpWrapperService) {
		console.log("Start SaisonService");
	}
	
	get(_id:number):any {
		return this.http.get_specific("saison", _id);
	};
	
	getVideo(_id:number):any {
		return this.http.get_specific("saison", _id, "video");
	};
	
}

