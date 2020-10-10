/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { HomeComponent } from './scene/home/home';
import { TypeComponent } from './scene/type/type';
import { UniversComponent } from './scene/univers/univers';
import { GroupComponent } from './scene/group/group';
import { SaisonComponent } from './scene/saison/saison';
import { VideoComponent } from './scene/video/video';
import { LoginComponent } from './scene/login/login';
import { SignUpComponent } from './scene/sign-up/sign-up';
import { SettingsComponent } from './scene/settings/settings';
import { VideoEditComponent } from './scene/video-edit/video-edit';
import { GroupEditComponent } from './scene/group-edit/group-edit';
import { SaisonEditComponent } from './scene/saison-edit/saison-edit';
import { UploadScene } from './scene/upload/upload';
//import { HelpComponent } from './help/help.component';


const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full'},
	{ path: 'home', component: HomeComponent },
	{ path: 'upload', component: UploadScene },
	{ path: 'type/:univers_id/:type_id/:group_id/:saison_id/:video_id', component: TypeComponent },
	
	{ path: 'univers/:univers_id/:type_id/:group_id/:saison_id/:video_id', component: UniversComponent },
	
	{ path: 'group/:univers_id/:type_id/:group_id/:saison_id/:video_id', component: GroupComponent },
	{ path: 'group-edit/:univers_id/:type_id/:group_id/:saison_id/:video_id', component: GroupEditComponent },
	
	{ path: 'saison/:univers_id/:type_id/:group_id/:saison_id/:video_id', component: SaisonComponent },
	{ path: 'saison-edit/:univers_id/:type_id/:group_id/:saison_id/:video_id', component: SaisonEditComponent },
	
	{ path: 'video/:univers_id/:type_id/:group_id/:saison_id/:video_id', component: VideoComponent },
	{ path: 'video-edit/:univers_id/:type_id/:group_id/:saison_id/:video_id', component: VideoEditComponent },
	
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

