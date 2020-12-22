/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Injectable, Output, EventEmitter, OnInit} from '@angular/core'

import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';

import { TypeService } from './type';
import { UniverseService } from './universe';
import { SeriesService } from './series';
import { SeasonService } from './season';
import { VideoService } from './video';
import { environment } from '../../environments/environment';

export class InputOrders {
    public type_id: number = null;
    public universe_id: number = null;
    public series_id: number = null;
    public season_id: number = null;
    public video_id: number = null;
}

@Injectable()
export class ArianeService {
    
    
    public type_id: number = null;
    public type_name: string = null;
    @Output() type_change: EventEmitter<number> = new EventEmitter();
    
    public universe_id: number = null;
    public universe_name: string = null;
    @Output() universe_change: EventEmitter<number> = new EventEmitter();
    
    public series_id: number = null;
    public series_name: string = null;
    @Output() series_change: EventEmitter<number> = new EventEmitter();
    
    public season_id: number = null;
    public season_name: string = null;
    @Output() season_change: EventEmitter<number> = new EventEmitter();
    
    public video_id: number = null;
    public video_name: string = null;
    @Output() video_change: EventEmitter<number> = new EventEmitter();
    
    constructor(private route: ActivatedRoute,
                private router: Router,
                private typeService: TypeService,
                private universeService: UniverseService,
                private seriesService: SeriesService,
                private seasonService: SeasonService,
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
        
        let universe_id = params.get('universe_id');
        if (universe_id === null || universe_id === undefined || universe_id == "null" || universe_id == "NULL" || universe_id == "") {
            universe_id = null;
        } else {
            universe_id = parseInt(universe_id)
        }
        console.log("universe_id = " + universe_id + "      " + params.get('univers_id'));
        
        let series_id = params.get('series_id');
        if (series_id === null || series_id === undefined || series_id == "null" || series_id == "NULL" || series_id == "") {
            series_id = null;
        } else {
            series_id = parseInt(series_id)
        }
        console.log("series_id = " + series_id + "      " + params.get('series_id'));
        
        let season_id = params.get('season_id');
        if (season_id === null || season_id === undefined || season_id == "null" || season_id == "NULL" || season_id == "") {
            season_id = null;
        } else {
            season_id = parseInt(season_id)
        }
        console.log("season_id = " + season_id + "      " + params.get('season_id'));
        
        let video_id = params.get('video_id');
        if (video_id === null || video_id === undefined || video_id == "null" || video_id == "NULL" || video_id == "") {
            video_id = null;
        } else {
            video_id = parseInt(video_id)
        }
        console.log("video_id = " + video_id + "      " + params.get('video_id'));
        
        this.setType(type_id);
        this.setUniverse(universe_id);
        this.setSeries(series_id);
        this.setSeason(season_id);
        this.setVideo(video_id);
    }
    reset():void {
        this.type_id = null;
        this.type_name = null;
        this.type_change.emit(this.type_id);
        this.universe_id = null;
        this.universe_name = null;
        this.universe_change.emit(this.universe_id);
        this.series_id = null;
        this.series_name = null;
        this.series_change.emit(this.series_id);
        this.season_id = null;
        this.season_name = null;
        this.season_change.emit(this.season_id);
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
        out.universe_id = parseInt(this.route.snapshot.paramMap.get('univers_id'));
        if (out.universe_id == 0){
            out.universe_id = undefined;
        }
        out.series_id = parseInt(this.route.snapshot.paramMap.get('series_id'));
        if (out.series_id == 0){
            out.series_id = undefined;
        }
        out.season_id = parseInt(this.route.snapshot.paramMap.get('season_id'));
        if (out.season_id == 0){
            out.season_id = undefined;
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
        this.router.navigate(['/type/' + this.type_id + '/series/' + this.id_series + '/season/' + _idSelected ]);
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
    
    setUniverse(_id:number) {
        if (this.universe_id == _id) {
            return;
        }
        if (_id === undefined) {
            return;
        }
        this.universe_id = _id;
        this.universe_name = "??--??";
        if (this.universe_id === null) {
            this.universe_change.emit(this.universe_id);
            return;
        }
        let self = this;
        this.universeService.get(_id)
            .then(function(response) {
                self.universe_name = response.number
                self.universe_change.emit(self.universe_id);
            }).catch(function(response) {
                self.universe_change.emit(self.universe_id);
            });
    }
    getUniverseId():number {
        return this.universe_id;
    }
    getUniverseName():string {
        return this.universe_name;
    }
    
    setSeries(_id:number):void {
        if (this.series_id == _id) {
            return;
        }
        if (_id === undefined) {
            return;
        }
        this.series_id = _id;
        this.series_name = "??--??";
        if (this.series_id === null) {
            this.series_change.emit(this.series_id);
            return;
        }
        let self = this;
        this.seriesService.get(_id)
            .then(function(response) {
                self.series_name = response.name
                self.series_change.emit(self.series_id);
            }).catch(function(response) {
                self.series_change.emit(self.series_id);
            });
    }
    getSeriesId():number {
        return this.series_id;
    }
    getSeriesName():string {
        return this.series_name;
    }
    
    setSeason(_id:number):void {
        if (this.season_id == _id) {
            return;
        }
        if (_id === undefined) {
            return;
        }
        this.season_id = _id;
        this.season_name = "??--??";
        if (this.season_id === null) {
            this.season_change.emit(this.season_id);
            return;
        }
        let self = this;
        this.seasonService.get(_id)
            .then(function(response) {
                //self.setSeries(response.series_id);
                self.season_name = response.name
                self.season_change.emit(self.season_id);
            }).catch(function(response) {
                self.season_change.emit(self.season_id);
            });
    }
    getSeasonId():number {
        return this.season_id;
    }
    getSeasonName():string {
        return this.season_name;
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
                //self.setSeason(response.season_id);
                //self.setSeries(response.series_id);
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
    
    genericNavigate(_destination:string, _universeId:number, _typeId:number, _seriesId:number, _seasonId:number, _videoId:number, _newWindows:boolean):void {
        let addressOffset = _destination + '/' + _universeId + '/' + _typeId + '/' + _seriesId + '/' + _seasonId + '/' + _videoId;
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

    navigateUniverse(_id:number, _newWindows:boolean):void {
        this.genericNavigate('universe', _id, this.type_id, null, null, null, _newWindows);
    }
    navigateUniverseEdit(_id:number, _newWindows:boolean):void {
        this.genericNavigate('universe-edit', _id, this.type_id, null, null, null, _newWindows);
    }
    navigateType(_id:number, _newWindows:boolean, _ctrl:boolean = false):void {
    	if (_ctrl == true) {
    		this.navigateTypeEdit(_id, _newWindows);
    		return;
    	}
        this.genericNavigate('type', this.universe_id, _id, null, null, null, _newWindows);
    }
    navigateTypeEdit(_id:number, _newWindows:boolean):void {
        this.genericNavigate('type-edit', this.universe_id, _id, null, null, null, _newWindows);
    }
    navigateSeries(_id:number, _newWindows:boolean, _ctrl:boolean = false):void {
    	if (_ctrl == true) {
    		this.navigateSeriesEdit(_id, _newWindows);
    		return;
    	}
        this.genericNavigate('series', this.universe_id, this.type_id, _id, null, null, _newWindows);
    }
    navigateSeriesEdit(_id:number, _newWindows:boolean):void {
        this.genericNavigate('series-edit', this.universe_id, this.type_id, _id, null, null, _newWindows);
    }
    navigateSeason(_id:number, _newWindows:boolean, _ctrl:boolean = false):void {
    	if (_ctrl == true) {
    		this.navigateSeasonEdit(_id, _newWindows);
    		return;
    	}
        this.genericNavigate('season', this.universe_id, this.type_id, this.series_id, _id, null, _newWindows);
    }
    navigateSeasonEdit(_id:number, _newWindows:boolean):void {
        this.genericNavigate('season-edit', this.universe_id, this.type_id, this.series_id, _id, null, _newWindows);
    }
    navigateVideo(_id:number, _newWindows:boolean, _ctrl:boolean = false):void {
    	console.log("======================================" + _ctrl);
    	if (_ctrl == true) {
    		this.navigateVideoEdit(_id, _newWindows);
    		return;
    	}
        this.genericNavigate('video', this.universe_id, this.type_id, this.series_id, this.season_id, _id, _newWindows);
    }
    navigateVideoEdit(_id:number, _newWindows:boolean):void {
        this.genericNavigate('video-edit', this.universe_id, this.type_id, this.series_id, this.season_id, _id, _newWindows);
    }


}