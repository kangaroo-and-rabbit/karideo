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

import { routing } from './app-routing.module';


import { HelpComponent } from './help/help.component';
import { AuthService } from './auth.service';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { ElementTypeComponent } from './element-type/element-type.component';
import { ElementGroupComponent } from './element-group/element-group.component';
import { ElementSaisonComponent } from './element-saison/element-saison.component';
import { ElementVideoComponent } from './element-video/element-video.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ValidateEmailComponent } from './validate-email/validate-email.component';
import { HomeComponent } from './home/home.component';
import { TypeDetailComponent } from './type-detail/type-detail.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { SaisonDetailComponent } from './saison-detail/saison-detail.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { ErrorViewerComponent } from './error-viewer/error-viewer.component';
import { ErrorComponent } from './error/error.component';

import { CookiesService } from './cookies.service';
import { HttpWrapperService } from './http-wrapper.service';
import { UserService } from './user.service';
import { GroupService } from './group.service';
import { TypeService } from './type.service';
import { SaisonService } from './saison.service';
import { VideoService } from './video.service';
import { SessionService } from './session.service';
import { AppComponent } from './app.component';




@NgModule({
	declarations: [
		AppComponent,
		TopMenuComponent,
		HelpComponent,
		ElementTypeComponent,
		ElementGroupComponent,
		ElementSaisonComponent,
		ElementVideoComponent,
		LoginComponent,
		SignUpComponent,
		ValidateEmailComponent,
		HomeComponent,
		TypeDetailComponent,
		GroupDetailComponent,
		SaisonDetailComponent,
		VideoDetailComponent,
		SettingsComponent,
		ErrorViewerComponent,
		ErrorComponent
		],
	imports: [
		BrowserModule,
		RouterModule,
		routing,
		BrowserAnimationsModule,
		HttpClientModule
		],
	providers: [
		HttpWrapperService,
		AuthService,
		SessionService,
		CookiesService,
		UserService,
		TypeService,
		GroupService,
		SaisonService,
		VideoService
		],
	bootstrap: [
		AppComponent
		]
})
export class AppModule { }
