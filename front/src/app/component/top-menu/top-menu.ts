/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { Injectable, Component, OnInit } from '@angular/core';

//import { AppRoutingModule } from "../app-routing.module";

import { Router } from "@angular/router";
import { ActivatedRoute, Params } from '@angular/router';
import { SessionService } from '../../service/session';
import { ArianeService } from '../../service/ariane';

@Component({
    selector: 'app-top-menu',
    templateUrl: './top-menu.html',
    styleUrls: ['./top-menu.less']
})
@Injectable()
export class TopMenuComponent implements OnInit {
    public login: string = null;//Session.getLogin();
    public avatar: string = null;//Session.getAvatar();
    public displayUserMenu: boolean = false;
    public displayEditMenu: boolean = false;
    
    public ariane_type_id: number = null;
    public ariane_type_name: string = null;
    
    public ariane_universe_id: number = null;
    public ariane_universe_name: string = null;
    
    public ariane_series_id: number = null;
    public ariane_series_name: string = null;
    
    public ariane_season_id: number = null;
    public ariane_season_name: string = null;
    
    public ariane_video_id: number = null;
    public ariane_video_name: string = null;
    
    public edit_show: boolean = false;
    
    constructor(private router: Router,
                private sessionService: SessionService,
                private arianeService: ArianeService) {
        
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
            this.updateEditShow();
        });
        this.arianeService.universe_change.subscribe(univers_id => {
            this.ariane_universe_id = univers_id;
            this.ariane_universe_name = this.arianeService.getUniverseName();
            this.updateEditShow();
        });
        this.arianeService.series_change.subscribe(series_id => {
            this.ariane_series_id = series_id;
            this.ariane_series_name = this.arianeService.getSeriesName();
            this.updateEditShow();
        });
        this.arianeService.season_change.subscribe(season_id => {
            this.ariane_season_id = season_id;
            this.ariane_season_name = this.arianeService.getSeasonName();
            this.updateEditShow();
        });
        this.arianeService.video_change.subscribe(video_id => {
            this.ariane_video_id = video_id;
            this.ariane_video_name = this.arianeService.getVideoName();
            this.updateEditShow();
        });
    }
    updateEditShow():void {
        this.edit_show = /*   this.ariane_type_id != null
                         || this.ariane_universe_id != null
                         ||*/ this.ariane_series_id != null
                         || this.ariane_season_id != null
                         || this.ariane_video_id != null;
    }
    onAvatar(): void {
        console.log("onAvatar() " + this.displayUserMenu);
        this.displayUserMenu = !this.displayUserMenu;
        this.displayEditMenu = false;
    }
    
    onEdit(): void {
        console.log("onEdit()");
        this.displayEditMenu = !this.displayEditMenu;
        this.displayUserMenu = false;
    }
    onSubEditVideo(_event: any): void {
        console.log("onSubEdit()");
        this.displayEditMenu = false;
        this.displayUserMenu = false;
        this.arianeService.navigateVideoEdit(this.ariane_video_id, _event.which==2);
    }
    onSubEditSeason(_event: any): void {
        console.log("onSubEdit()");
        this.displayEditMenu = false;
        this.displayUserMenu = false;
        this.arianeService.navigateSeasonEdit(this.ariane_season_id, _event.which==2);
    }
    onSubEditSeries(_event: any): void {
        console.log("onSubEdit()");
        this.displayEditMenu = false;
        this.displayUserMenu = false;
        this.arianeService.navigateSeriesEdit(this.ariane_series_id, _event.which==2);
    }
    onSubEditUniverse(_event: any): void {
        console.log("onSubEdit()");
        this.displayEditMenu = false;
        this.displayUserMenu = false;
        this.arianeService.navigateUniverseEdit(this.ariane_universe_id, _event.which==2);
    }
    onSubEditType(_event: any): void {
        console.log("onSubEditType()");
        this.displayEditMenu = false;
        this.displayUserMenu = false;
        this.arianeService.navigateTypeEdit(this.ariane_type_id, _event.which==2);
    }
    
    onHome(_event: any): void {
        console.log("onHome()");
        this.router.navigate(['home']);
    }
    
    onSignIn(_event: any): void {
        console.log("onSignIn()");
        //Session.destroy();
        this.router.navigate(['signup']);
    }
    
    onLogin(_event: any): void {
        console.log("onLogin()");
        //Session.destroy();
        this.router.navigate(['login']);
        this.displayUserMenu = false;
    }
    
    onLogout(_event: any): void {
        console.log("onLogout()");
        this.sessionService.destroy();
        this.router.navigate(['home']);
        this.displayUserMenu = false;
	}
	
    onAddMedia(_event: any): void {
        console.log("onAddMedia()");
        this.router.navigate(['upload']);
        this.displayUserMenu = false;
    }
    
    onSetting(_event: any): void {
        console.log("onSetting()");
        this.router.navigate(['settings']);
        this.displayUserMenu = false;
    }
    
    onHelp(_event: any): void {
        console.log("onHelp()");
        this.router.navigate(['help']);
        this.displayUserMenu = false;
    }
    
    onOutUserProperty(): void {
        console.log("onOutUserProperty ==> event...");
        this.displayUserMenu = false;
        this.displayEditMenu = false;
    }
    
    onArianeType(_event: any): void {
        console.log("onArianeType(" + this.ariane_type_id + ")");
        this.arianeService.navigateType(this.ariane_type_id, _event.which==2);
    }
    
    onArianeUniverse(_event: any): void {
        console.log("onArianeUniverse(" + this.ariane_universe_id + ")");
        this.arianeService.navigateUniverse(this.ariane_universe_id, _event.which==2);
    }
    
    onArianeSeries(_event: any): void {
        console.log("onArianeSeries(" + this.ariane_series_id + ")");
        this.arianeService.navigateSeries(this.ariane_series_id, _event.which==2);
    }
    
    onArianeSeason(_event: any): void {
        console.log("onArianeSeason(" + this.ariane_season_id + ")");
        this.arianeService.navigateSeason(this.ariane_season_id, _event.which==2);
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