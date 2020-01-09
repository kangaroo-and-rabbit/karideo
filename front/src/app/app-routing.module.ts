/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { TypeDetailComponent } from './type-detail/type-detail.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { SaisonDetailComponent } from './saison-detail/saison-detail.component';
import { VideoDetailComponent } from './video-detail/video-detail.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SettingsComponent } from './settings/settings.component';
import { VideoEditComponent } from './scene/video-edit/video-edit';
//import { HelpComponent } from './help/help.component';


const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full'},
	{ path: 'home', component: HomeComponent },
	{ path: 'type/:id', component: TypeDetailComponent },
	{ path: 'group/:id', component: GroupDetailComponent },
	{ path: 'saison/:id', component: SaisonDetailComponent },
	{ path: 'video/:id', component: VideoDetailComponent },
	{ path: 'video-edit/:id', component: VideoEditComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignUpComponent },
	{ path: 'settings', component: SettingsComponent },
	/*{ path: 'help', component: HelpComponent }*/
];
/*
@NgModule({
	imports: [
		RouterModule.forRoot(routes)
		],
	exports: [
		RouterModule
		]
})

export class AppRoutingModule {}
*/

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

