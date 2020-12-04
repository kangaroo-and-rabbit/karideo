/** @file
 * @author Edouard DUPIN
 * @copyright 2018, Edouard DUPIN, all right reserved
 * @license PROPRIETARY (see license file)
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { ModuleWithProviders } from '@angular/core';

import { HomeScene } from './scene/home/home';
import { TypeScene } from './scene/type/type';
import { UniverseScene } from './scene/universe/universe';
import { SeriesScene } from './scene/series/series';
import { SeasonScene } from './scene/season/season';
import { VideoScene } from './scene/video/video';
import { LoginScene } from './scene/login/login';
import { SignUpScene } from './scene/sign-up/sign-up';
import { SettingsScene } from './scene/settings/settings';
import { UploadScene } from './scene/upload/upload';
import { VideoEditScene } from './scene/video-edit/video-edit';
import { SeriesEditScene } from './scene/series-edit/series-edit';
import { SeasonEditScene } from './scene/season-edit/season-edit';
//import { HelpComponent } from './help/help.component';

// see https://angular.io/guide/router


const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full'},
	{ path: 'home', component: HomeScene },
	{ path: 'upload', component: UploadScene },
	{ path: 'type/:universe_id/:type_id/:series_id/:season_id/:video_id', component: TypeScene },
	
	{ path: 'universe/:universe_id/:type_id/:series_id/:season_id/:video_id', component: UniverseScene },
	
	{ path: 'series/:universe_id/:type_id/:series_id/:season_id/:video_id', component: SeriesScene },
	{ path: 'series-edit/:universe_id/:type_id/:series_id/:season_id/:video_id', component: SeriesEditScene },
	
	{ path: 'season/:universe_id/:type_id/:series_id/:season_id/:video_id', component: SeasonScene },
	{ path: 'season-edit/:universe_id/:type_id/:series_id/:season_id/:video_id', component: SeasonEditScene },
	
	{ path: 'video/:universe_id/:type_id/:series_id/:season_id/:video_id', component: VideoScene },
	{ path: 'video-edit/:universe_id/:type_id/:series_id/:season_id/:video_id', component: VideoEditScene },
	
	{ path: 'login', component: LoginScene },
	{ path: 'signup', component: SignUpScene },
	{ path: 'settings', component: SettingsScene },
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

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
		
		