/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { SelectDropDownModule } from 'ngx-select-dropdown'

// see here: https://material.angular.io/components/categories

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//import { MatProgressBarModule } from '@angular/material/progress-bar';

import { UploadFileComponent } from './component/upload-file/upload-file';
import { TopMenuComponent } from './component/top-menu/top-menu';
import { ElementTypeComponent } from './component/element-type/element-type';
import { ElementGroupComponent } from './component/element-group/element-group';
import { ElementSaisonComponent } from './component/element-saison/element-saison';
import { ElementVideoComponent } from './component/element-video/element-video';
import { CreateTypeComponent } from './component/create-type/create-type';
import { PopInUploadProgress } from './component/upload-progress/upload-progress';
import { PopInComponent } from './component/popin/popin';

import { HelpComponent } from './scene/help/help';
import { LoginComponent } from './scene/login/login';
import { SignUpComponent } from './scene/sign-up/sign-up';
import { ValidateEmailComponent } from './scene/validate-email/validate-email';
import { HomeComponent } from './scene/home/home';
import { TypeComponent } from './scene/type/type';
import { UniversComponent } from './scene/univers/univers';
import { GroupComponent } from './scene/group/group';
import { SaisonComponent } from './scene/saison/saison';
import { VideoComponent } from './scene/video/video';
import { SettingsComponent } from './scene/settings/settings';
import { ErrorViewerComponent } from './scene/error-viewer/error-viewer';
import { ErrorComponent } from './error/error';
import { VideoEditComponent } from './scene/video-edit/video-edit';
import { UploadScene } from './scene/upload/upload';
import { SaisonEditComponent } from './scene/saison-edit/saison-edit';
import { GroupEditComponent } from './scene/group-edit/group-edit';

import { AuthService } from './service/auth';
import { ArianeService } from './service/ariane';
import { CookiesService } from './service/cookies';
import { HttpWrapperService } from './service/http-wrapper';
import { HttpOAuthWrapperService } from './service/http-oauth-wrapper';
import { UserService } from './service/user';
import { UniversService } from './service/univers';
import { GroupService } from './service/group';
import { DataService } from './service/data';
import { TypeService } from './service/type';
import { SaisonService } from './service/saison';
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
		HelpComponent,
		ElementTypeComponent,
		ElementGroupComponent,
		ElementSaisonComponent,
		ElementVideoComponent,
		LoginComponent,
		SignUpComponent,
		ValidateEmailComponent,
		HomeComponent,
		TypeComponent,
		UniversComponent,
		GroupComponent,
		SaisonComponent,
		VideoComponent,
		SettingsComponent,
		ErrorViewerComponent,
		ErrorComponent,
		VideoEditComponent,
		SaisonEditComponent,
		GroupEditComponent,
		PopInComponent,
		PopInUploadProgress,
		CreateTypeComponent,
		UploadScene
		],
	imports: [
		BrowserModule,
		RouterModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule,
		SelectDropDownModule
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
		UniversService,
		GroupService,
		SaisonService,
		VideoService,
		ArianeService
		],
	bootstrap: [
		AppComponent
		]
})
export class AppModule { }
