/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { SessionService } from '../session.service';
import { ArianeService } from '../ariane.service';

@Component({
	selector: 'app-top-menu',
	templateUrl: './top-menu.component.html',
	styleUrls: ['./top-menu.component.less']
})
@Injectable()
export class TopMenuComponent implements OnInit {
	public login: string = null;//Session.getLogin();
	public avatar: string = null;//Session.getAvatar();
	public displayUserMenu: boolean = false;
	
	public ariane_type_id: number = null;
	public ariane_type_name: string = null;
	
	public ariane_univers_id: number = null;
	public ariane_univers_name: string = null;
	
	public ariane_group_id: number = null;
	public ariane_group_name: string = null;
	
	public ariane_saison_id: number = null;
	public ariane_saison_name: string = null;
	
	public editable:boolean = false;
	
	constructor(private router: Router,
	            private sessionService: SessionService,
	            private arianeService: ArianeService) {
		
	}
	
	updateEditable() {
		if (this.arianeService.getVideoId() != null) {
			this.editable = true;
		} else {
			this.editable = false;
		}
	}
	ngOnInit() {
		this.sessionService.change.subscribe(isConnected => {
			console.log("receive event from session ..." + isConnected);
			if (isConnected == false) {
				this.login = null;
				this.avatar = null;
				this.displayUserMenu = false;
			} else {
				this.login = this.sessionService.getLogin();
				this.avatar = this.sessionService.getAvatar();
				this.displayUserMenu = false;
				console.log(" login:" + this.sessionService.getLogin());
				console.log(" avatar:" + this.avatar);
			}
		});
		this.arianeService.type_change.subscribe(type_id => {
			this.ariane_type_id = type_id;
			this.ariane_type_name = this.arianeService.getTypeName();
			this.updateEditable();
		});
		this.arianeService.univers_change.subscribe(univers_id => {
			this.ariane_univers_id = univers_id;
			this.ariane_univers_name = this.arianeService.getUniversName();
			this.updateEditable();
		});
		this.arianeService.group_change.subscribe(group_id => {
			this.ariane_group_id = group_id;
			this.ariane_group_name = this.arianeService.getGroupName();
			this.updateEditable();
		});
		this.arianeService.saison_change.subscribe(saison_id => {
			this.ariane_saison_id = saison_id;
			this.ariane_saison_name = this.arianeService.getSaisonName();
			this.updateEditable();
		});
		this.arianeService.video_change.subscribe(video_id => {
			this.updateEditable();
		});
	}
	onAvatar(): void {
		console.log("onAvatar() " + this.displayUserMenu);
		this.displayUserMenu = !this.displayUserMenu;
	}
	
	onEdit(): void {
		console.log("onEdit()");
		if (this.arianeService.getVideoId() != null) {
			this.router.navigate(['video-edit/' + this.arianeService.getVideoId()]);
		}
	}
	
	onHome(): void {
		console.log("onHome()");
		this.router.navigate(['home']);
	}
	
	onSignIn(): void {
		console.log("onSignIn()");
		//Session.destroy();
		this.router.navigate(['signup']);
	}
	
	onLogin(): void {
		console.log("onLogin()");
		//Session.destroy();
		this.router.navigate(['login']);
		this.displayUserMenu = false;
	}
	
	onLogout(): void {
		console.log("onLogout()");
		this.sessionService.destroy();
		this.router.navigate(['home']);
		this.displayUserMenu = false;
	}
	
	onSetting(): void {
		console.log("onSetting()");
		this.router.navigate(['settings']);
		this.displayUserMenu = false;
	}
	
	onHelp(): void {
		console.log("onHelp()");
		this.router.navigate(['help']);
		this.displayUserMenu = false;
	}
	
	onOutUserProperty(): void {
		console.log("onOutUserProperty ==> event...");
		this.displayUserMenu = false;
	}
	
	onArianeType(): void {
		console.log("onArianeType(" + this.ariane_type_id + ")");
		this.router.navigate(['type/' + this.ariane_type_id ]);
		this.ariane_univers_id = null;
		this.ariane_univers_name = null;
		this.ariane_group_id = null;
		this.ariane_group_name = null;
		this.ariane_saison_id = null;
		this.ariane_saison_name = null;
	}
	
	onArianeUnivers(): void {
		console.log("onArianeUnivers(" + this.ariane_univers_id + ")");
		this.router.navigate(['univers/' + this.ariane_univers_id ]);
		this.ariane_group_id = null;
		this.ariane_group_name = null;
		this.ariane_saison_id = null;
		this.ariane_saison_name = null;
	}
	
	onArianeGroup(): void {
		console.log("onArianeGroup(" + this.ariane_group_id + ")");
		this.router.navigate(['group/' + this.ariane_group_id ]);
		this.ariane_saison_id = null;
		this.ariane_saison_name = null;
	}
	
	onArianeSaison(): void {
		console.log("onArianeSaison(" + this.ariane_saison_id + ")");
		this.router.navigate(['saison/' + this.ariane_saison_id ]);
	}

}

/*

app.controller("controlerTop", function($scope, $rootScope, SESSION_EVENTS, Session, USER_ROLES) {
	
	$rootScope.$on(SESSION_EVENTS.login, function(event) {
		console.log("event ... " + SESSION_EVENTS.login);
		$scope.login = Session.getLogin();
		$scope.avatar = Session.getAvatar();
		$scope.displayUserMenu = false;
		$rootScope.currentDisplay = "home.html";
		$rootScope.currentModal = "";
		$rootScope.currentModalCanRemove = false;
	});
	$rootScope.$on(SESSION_EVENTS.logout, function(event) {
		console.log("event ... " + SESSION_EVENTS.login);
		$scope.login = Session.getLogin();
		$scope.avatar = Session.getAvatar();
		$scope.displayUserMenu = false;
		$rootScope.currentDisplay = "home.html";
		$rootScope.currentModal = "";
		$rootScope.currentModalCanRemove = false;
	});
	$scope.login = Session.getLogin();
	$scope.avatar = Session.getAvatar();
	$scope.displayUserMenu = false;
	
	$scope.onAvatar = function() {
		$scope.displayUserMenu = !$scope.displayUserMenu;
	}
	
	$scope.onHome = function() {
		$rootScope.currentDisplay = "home.html";
	}
	
	$scope.onSignIn = function() {
		Session.destroy();
		$rootScope.currentDisplay = "signUp.html";
	}
	
	$scope.onLogin = function() {
		Session.destroy();
		$rootScope.currentModal = "login.html";
		$scope.displayUserMenu = false;
	}
	
	$scope.onLogout = function() {
		Session.destroy();
		$rootScope.currentDisplay = "home.html";
		$scope.displayUserMenu = false;
	}
	
	$scope.onSetting = function() {
		$rootScope.currentModal = "";
		$rootScope.currentDisplay = "setting.html";
		$scope.displayUserMenu = false;
	}
	
	$scope.onHelp = function() {
		$rootScope.currentModal = "";
		$rootScope.currentDisplay = "help.html";
		$scope.displayUserMenu = false;
	}
	
	$scope.onOutUserProperty = function() {
		console.log("onOutUserProperty ==> event...");
		$rootScope.currentModal = "";
		$scope.displayUserMenu = false;
	}
});

*/