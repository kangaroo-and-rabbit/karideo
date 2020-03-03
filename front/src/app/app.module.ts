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

import { routing } from './app-routing.module';


import { UploadFileComponent } from './component/upload-file/upload-file.component';
import { TopMenuComponent } from './component/top-menu/top-menu.component';
import { ElementTypeComponent } from './component/element-type/element-type.component';
import { ElementGroupComponent } from './component/element-group/element-group.component';
import { ElementSaisonComponent } from './component/element-saison/element-saison.component';
import { ElementVideoComponent } from './component/element-video/element-video.component';
import { ModalComponent } from './component/modal/modal';

import { HelpComponent } from './scene/help/help.component';
import { LoginComponent } from './scene/login/login.component';
import { SignUpComponent } from './scene/sign-up/sign-up.component';
import { ValidateEmailComponent } from './scene/validate-email/validate-email.component';
import { HomeComponent } from './scene/home/home.component';
import { TypeComponent } from './scene/type/type.component';
import { UniversComponent } from './scene/univers/univers';
import { GroupComponent } from './scene/group/group.component';
import { SaisonComponent } from './scene/saison/saison.component';
import { VideoComponent } from './scene/video/video.component';
import { SettingsComponent } from './scene/settings/settings.component';
import { ErrorViewerComponent } from './scene/error-viewer/error-viewer.component';
import { ErrorComponent } from './error/error.component';
import { VideoEditComponent } from './scene/video-edit/video-edit';
import { SaisonEditComponent } from './scene/saison-edit/saison-edit';
import { GroupEditComponent } from './scene/group-edit/group-edit';

import { AuthService } from './service/auth.service';
import { ArianeService } from './service/ariane.service';
import { CookiesService } from './service/cookies.service';
import { HttpWrapperService } from './service/http-wrapper.service';
import { UserService } from './service/user.service';
import { UniversService } from './service/univers.service';
import { GroupService } from './service/group.service';
import { DataService } from './service/data.service';
import { TypeService } from './service/type.service';
import { SaisonService } from './service/saison.service';
import { VideoService } from './service/video.service';
import { SessionService } from './service/session.service';
import { BddService } from './service/bdd.service';
import { ModalService } from './service/modal';
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
		ModalComponent
		],
	imports: [
		BrowserModule,
		RouterModule,
		routing,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule
		],
	providers: [
		ModalService,
		HttpWrapperService,
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
