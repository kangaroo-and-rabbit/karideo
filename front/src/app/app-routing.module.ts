/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { HomeComponent } from './scene/home/home.component';
import { TypeComponent } from './scene/type/type.component';
import { UniversComponent } from './scene/univers/univers';
import { GroupComponent } from './scene/group/group.component';
import { SaisonComponent } from './scene/saison/saison.component';
import { VideoComponent } from './scene/video/video.component';
import { LoginComponent } from './scene/login/login.component';
import { SignUpComponent } from './scene/sign-up/sign-up.component';
import { SettingsComponent } from './scene/settings/settings.component';
import { VideoEditComponent } from './scene/video-edit/video-edit';
//import { HelpComponent } from './help/help.component';


const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full'},
	{ path: 'home', component: HomeComponent },
	{ path: 'type/:type_id', component: TypeComponent },
	{ path: 'univers/:univers_id', component: UniversComponent },
	//{ path: 'type/:type_id/univers/:univers_id',                 component: UniversComponent },
	{ path: 'group/:group_id', component: GroupComponent },
	//{ path: 'type/:type_id/group/:group_id',                     component: GroupComponent },
	//{ path: 'type/:type_id/univers/:univers_id/group/:group_id', component: GroupComponent },
	//{ path: 'univers/:univers_id/group/:group_id',               component: GroupComponent },
	{ path: 'saison/:saison_id', component: SaisonComponent },
	//{ path: 'type/:type_id/univers/:univers_id/group/:group_id/saison/:saison_id',    component: SaisonComponent },
	{ path: 'video/:video_id', component: VideoComponent },
	//{ path: 'type/:type_id/univers/:univers_id/group/:group_id/saison/:saison_id/video/:video_id',    component: VideoComponent },
	//{ path: 'type/:type_id/univers/:univers_id/group/:group_id/saison/:saison_id/video/:video_id/edit', component: VideoEditComponent },
	{ path: 'video-edit/:video_id', component: VideoEditComponent },
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

