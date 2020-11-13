/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { interval } from 'rxjs';
import { fadeInAnimation } from '../../_animations/index';
import { HttpWrapperService } from '../../service/http-wrapper';
import { VideoService } from '../../service/video';
import { SeriesService } from '../../service/series';
import { SeasonService } from '../../service/season';
import { ArianeService } from '../../service/ariane';

@Component({
	selector: 'app-video',
	templateUrl: './video.html',
	styleUrls: ['./video.less'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})

export class VideoScene implements OnInit {
	videoGlobal:any;
	@ViewChild('globalVideoElement')
	  set mainDivEl(el: ElementRef) {
		if (el != null) {
		    this.videoGlobal = el.nativeElement;
		}
	 }
	videoPlayer: HTMLVideoElement;
	@ViewChild('videoPlayer')
	  set mainVideoEl(el: ElementRef) {
		if (el != null) {
		    this.videoPlayer = el.nativeElement;
		}
	 }

	
	id_video:number = -1;

	mediaIsNotFound:boolean = false;
	mediaIsLoading:boolean = true;
	error:string = "";
	
	name:string = "";
	description:string = "";
	episode:number = undefined;
	series_id:number = undefined;
	series_name:string = undefined;
	season_id:number = undefined;
	season_name:string = undefined;
	data_id:number = -1;
	time:number = undefined;
	type_id:number = undefined;
	generated_name:string = "";
	video_source:string = "";
	cover:string = null;
	covers:Array<string> = [];
	
	playVideo:boolean = false;
	displayVolumeMenu:boolean = false;
	isPlaying:boolean = false;
	isFullScreen:boolean = false;
	currentTime:number = 0;
	currentTimeDisplay:string = "00";
	duration:number = 0;
	durationDisplay:string = "00";
	volumeValue:number = 100;
			
	constructor(private route: ActivatedRoute,
	            private router: Router,
	            private locate: Location,
	            private videoService: VideoService,
	            private seriesService: SeriesService,
	            private seasonService: SeasonService,
	            private httpService: HttpWrapperService,
	            private arianeService: ArianeService) {
		
	}
	
	generateName() {
		this.generated_name = "";
		if (this.series_name != undefined) {
			this.generated_name += this.series_name + "-";
		}
		if (this.season_name != undefined) {
			if (this.season_name.length < 2) {
				this.generated_name += "s0" + this.season_name + "-";
			} else {
				this.generated_name += "s" + this.season_name + "-";
			}
		}
		if (this.episode != undefined) {
			if (this.episode < 10) {
				this.generated_name += "e0" + this.episode + "-";
			} else {
				this.generated_name += "e" + this.episode + "-";
			}
		}
		this.generated_name += this.name;
	}
	
	myPeriodicCheckFunction() {
		console.log("check ... ");
	}
	
	ngOnInit() {
		interval(1000).subscribe(x => {
		    this.myPeriodicCheckFunction();
		});
		this.arianeService.updateManual(this.route.snapshot.paramMap);
		
		this.id_video = this.arianeService.getVideoId();
		let self = this;
		this.videoService.get(this.id_video)
			.then(function(response) {
				console.log("get response of video : " + JSON.stringify(response, null, 2));
				self.error = "";
				self.name = response.name;
				self.description = response.description;
				self.episode = response.episode;
				self.series_id = response.series_id;
				self.season_id = response.season_id;
				self.data_id = response.data_id;
				self.time = response.time;
				self.generated_name = response.generated_name;
				if (self.data_id != -1) {
					self.video_source = self.httpService.createRESTCall("data/" + self.data_id);
				} else {
					self.video_source = "";
				}
				if (response.covers == undefined || response.covers == null || response.covers.length == 0) {
					self.cover = null;
				} else {
					self.cover = self.videoService.getCoverUrl(response.covers[0]);
					for (let iii=0; iii<response.covers.length; iii++) {
						self.covers.push(self.videoService.getCoverUrl(response.covers[iii]));
					}
				}
				self.generateName();
				if (self.series_id !== undefined && self.series_id !== null) {
					self.seriesService.get(self.series_id)
						.then(function(response) {
							self.series_name = response.name;
							self.generateName();
						}).catch(function(response) {
							// nothing to do ...
						});
				}
				if (self.season_id !== undefined && self.season_id !== null) {
					self.seasonService.get(self.season_id)
						.then(function(response) {
							self.season_name = response.name;
							self.generateName();
						}).catch(function(response) {
							// nothing to do ...
						});
				}
				self.mediaIsLoading = false;
				//console.log("display source " + self.video_source);
				//console.log("set transformed : " + JSON.stringify(self, null, 2));
			}).catch(function(response) {
				self.error = "Can not get the data";
				self.name = "";
				self.description = "";
				self.episode = undefined;
				self.series_id = undefined;
				self.season_id = undefined;
				self.data_id = -1;
				self.time = undefined;
				self.generated_name = "";
				self.video_source = "";
				self.cover = null;
				self.series_name = undefined;
				self.season_name = undefined;
				self.mediaIsNotFound = true;
				self.mediaIsLoading = false;
			});
	}
	onRequirePlay() {
		this.playVideo = true;
		this.displayVolumeMenu = false;
	}
	onRequireStop() {
		this.playVideo = false;
		this.displayVolumeMenu = false;
	}
	onVideoEnded() {
		this.playVideo = false;
		this.displayVolumeMenu = false;
	}
	
	//https://www.w3schools.com/tags/ref_av_dom.asp

	changeStateToPlay() {
		this.isPlaying = true;
	}
	changeStateToPause() {
		this.isPlaying = false;
	}
	
	convertIndisplayTime(time:number) : string {
		let tmpp = parseInt("" + time);
		let heures = parseInt("" + (tmpp/3600));
		tmpp = tmpp - heures * 3600;
		let minutes = parseInt("" + (tmpp/60));
		let seconds = tmpp - minutes * 60;
		let out = "";
		if (heures != 0) {
			out += heures + ":";
		}
		if (minutes >= 10) {
			out += minutes + ":";
		} else {
			out += "0" + minutes + ":";
		}
		if (seconds >= 10) {
			out += seconds;
		} else {
			out += "0" + seconds;
		}
		return out;
	}
	
	changeTimeupdate(currentTime:any) {
		//console.log("time change ");
		//console.log("    ==> " + this.videoPlayer.currentTime);
		this.currentTime = this.videoPlayer.currentTime;
		this.currentTimeDisplay = this.convertIndisplayTime(this.currentTime);
		//console.log("    ==> " + this.currentTimeDisplay);
	}
	changeDurationchange(duration:any) {
		console.log("duration change ");
		console.log("    ==> " + this.videoPlayer.duration);
		this.duration = this.videoPlayer.duration;
		this.durationDisplay = this.convertIndisplayTime(this.duration);
	}
	
	onPlay() {
		console.log("play");
		if (this.videoPlayer === null
			 || this.videoPlayer === undefined) {
			console.log("error elemrent: " + this.videoPlayer);
			return;
		}
		this.videoPlayer.volume = this.volumeValue/100;
		this.videoPlayer.play();
	}
	
	onPause() {
		console.log("pause");
		if (this.videoPlayer === null
			 || this.videoPlayer === undefined) {
			console.log("error elemrent: " + this.videoPlayer);
			return;
		}
		this.videoPlayer.pause();
	}
	
	onStop() {
		console.log("stop");
		if (this.videoPlayer === null
			 || this.videoPlayer === undefined) {
			console.log("error elemrent: " + this.videoPlayer);
			return;
		}
		this.videoPlayer.pause();
		this.videoPlayer.currentTime = 0;
		
	}
	
	onBefore() {
		console.log("before");
	}
	
	onNext() {
		console.log("next");
	}
	
	seek(newValue:any) {
		console.log("seek " + newValue.value);
		console.log("next");
		if (this.videoPlayer === null
			 || this.videoPlayer === undefined) {
			console.log("error elemrent: " + this.videoPlayer);
			return;
		}
		this.videoPlayer.currentTime = newValue.value;
	}
	
	onRewind() {
		console.log("rewind");
		if (this.videoPlayer === null
			 || this.videoPlayer === undefined) {
			console.log("error elemrent: " + this.videoPlayer);
			return;
		}
		this.videoPlayer.currentTime = this.currentTime - 10;
	}
	
	onForward() {
		console.log("forward");
		if (this.videoPlayer === null
			 || this.videoPlayer === undefined) {
			console.log("error elemrent: " + this.videoPlayer);
			return;
		}
		this.videoPlayer.currentTime = this.currentTime + 10;
	}
	
	onMore() {
		console.log("more");
		if (this.videoPlayer === null
			 || this.videoPlayer === undefined) {
			console.log("error elemrent: " + this.videoPlayer);
			return;
		}
	}
	onFullscreen() {
		console.log("fullscreen");
		if (this.videoGlobal === null
			 || this.videoGlobal === undefined) {
			console.log("error elemrent: " + this.videoGlobal);
			return;
		}
		if (this.videoGlobal.requestFullscreen) {
			this.videoGlobal.requestFullscreen();
		} else if (this.videoGlobal.mozRequestFullScreen) {
			this.videoGlobal.mozRequestFullScreen();
		} else if (this.videoGlobal.webkitRequestFullscreen) {
			this.videoGlobal.webkitRequestFullscreen();
		} else if (this.videoGlobal.msRequestFullscreen) {
			this.videoGlobal.msRequestFullscreen();
		}
	}
	
	onFullscreenExit() {
		this.onFullscreenExit22(document);
	}
	onFullscreenExit22(docc:any) {
		console.log("fullscreen EXIT");
		if (this.videoGlobal === null
			 || this.videoGlobal === undefined) {
			console.log("error elemrent: " + this.videoGlobal);
			return;
		}
		if (docc.exitFullscreen) {
			docc.exitFullscreen();
		} else if (docc.mozCancelFullScreen) {
			docc.mozCancelFullScreen();
		} else if (docc.webkitExitFullscreen) {
			docc.webkitExitFullscreen();
		} else if (docc.msExitFullscreen) {
			docc.msExitFullscreen();
		}
	}
	
	onFullscreenChange() {
		this.onFullscreenChange22(document);
	}
	onFullscreenChange22(element:any) {
		var isInFullScreen = (element.fullscreenElement && element.fullscreenElement !== null) ||
		        (element.webkitFullscreenElement && element.webkitFullscreenElement !== null) ||
		        (element.mozFullScreenElement && element.mozFullScreenElement !== null) ||
		        (element.msFullscreenElement && element.msFullscreenElement !== null);
		console.log("onFullscreenChange(" + isInFullScreen + ")");
		this.isFullScreen = isInFullScreen;
	}
	
	onVolumeMenu() {
		this.displayVolumeMenu = !this.displayVolumeMenu;
	}
	
	onVolume(newValue:any) {
		console.log("onVolume " + newValue.value);
		if (this.videoPlayer === null
			 || this.videoPlayer === undefined) {
			console.log("error elemrent: " + this.videoPlayer);
			return;
		}
		this.volumeValue = newValue.value;
		this.videoPlayer.volume = this.volumeValue/100;
		this.videoPlayer.muted=false;
	}
	
	onVolumeMute() {
		if (this.videoPlayer === null
			 || this.videoPlayer === undefined) {
			console.log("error elemrent: " + this.videoPlayer);
			return;
		}
		this.videoPlayer.muted=true;
	}
	
	onVolumeUnMute() {
		if (this.videoPlayer === null
				 || this.videoPlayer === undefined) {
				console.log("error elemrent: " + this.videoPlayer);
				return;
			}
		this.videoPlayer.muted=false;
	}
}
