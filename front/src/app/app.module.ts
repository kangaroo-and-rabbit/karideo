/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { UploadFileComponent } from './component/upload-file/upload-file';
import { TopMenuComponent } from './component/top-menu/top-menu';
import { ElementTypeComponent } from './component/element-type/element-type';
import { ElementSeriesComponent } from './component/element-series/element-series';
import { ElementSeasonComponent } from './component/element-season/element-season';
import { ElementVideoComponent } from './component/element-video/element-video';
import { PopInComponent } from './component/popin/popin';

import { CreateTypeComponent } from './popin/create-type/create-type';
import { PopInUploadProgress } from './popin/upload-progress/upload-progress';
import { PopInDeleteConfirm } from './popin/delete-confirm/delete-confirm';

import { HelpScene } from './scene/help/help';
import { LoginScene } from './scene/login/login';
import { SignUpScene } from './scene/sign-up/sign-up';
import { ValidateEmailScene } from './scene/validate-email/validate-email';
import { HomeScene } from './scene/home/home';
import { TypeScene } from './scene/type/type';
import { UniverseScene } from './scene/universe/universe';
import { SeriesScene } from './scene/series/series';
import { SeasonScene } from './scene/season/season';
import { VideoScene } from './scene/video/video';
import { SettingsScene } from './scene/settings/settings';
import { ErrorViewerScene } from './scene/error-viewer/error-viewer';
import { ErrorComponent } from './error/error';
import { VideoEditScene } from './scene/video-edit/video-edit';
import { UploadScene } from './scene/upload/upload';
import { SeasonEditScene } from './scene/season-edit/season-edit';
import { SeriesEditScene } from './scene/series-edit/series-edit';

import { AuthService } from './service/auth';
import { ArianeService } from './service/ariane';
import { CookiesService } from './service/cookies';
import { HttpWrapperService } from './service/http-wrapper';
import { HttpOAuthWrapperService } from './service/http-oauth-wrapper';
import { UserService } from './service/user';
import { UniverseService } from './service/universe';
import { SeriesService } from './service/series';
import { DataService } from './service/data';
import { TypeService } from './service/type';
import { SeasonService } from './service/season';
import { VideoService } from './service/video';
import { SessionService } from './service/session';
import { BddService } from './service/bdd';
import { PopInService } from './service/popin';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent,
		TopMenuComponent,
		UploadFileComponent,
		ElementTypeComponent,
		ElementSeriesComponent,
		ElementSeasonComponent,
		ElementVideoComponent,
		ErrorComponent,
		CreateTypeComponent,

		PopInComponent,
		PopInUploadProgress,
		PopInDeleteConfirm,

		HelpScene,
		LoginScene,
		SignUpScene,
		ValidateEmailScene,
		HomeScene,
		TypeScene,
		UniverseScene,
		SeriesScene,
		SeasonScene,
		VideoScene,
		SettingsScene,
		ErrorViewerScene,
		VideoEditScene,
		SeasonEditScene,
		SeriesEditScene,
		UploadScene
		],
	imports: [
		BrowserModule,
		RouterModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule
		],
	providers: [
		PopInService,
		HttpWrapperService,
		HttpOAuthWrapperService,
		BddService,
		AuthService,
		SessionService,
		CookiesService,
		UserService,
		TypeService,
		DataService,
		UniverseService,
		SeriesService,
		SeasonService,
		VideoService,
		ArianeService
		],
	exports: [
  		AppComponent,
		TopMenuComponent,
		UploadFileComponent,
		ElementTypeComponent,
		ElementSeriesComponent,
		ElementSeasonComponent,
		ElementVideoComponent,
		ErrorComponent,
		CreateTypeComponent,

		PopInComponent,
		PopInUploadProgress,
		PopInDeleteConfirm
  		],
	bootstrap: [
		AppComponent
		],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class AppModule { }
