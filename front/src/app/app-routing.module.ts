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
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SettingsComponent } from './settings/settings.component';
//import { HelpComponent } from './help/help.component';


const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full'},
	{ path: 'home', component: HomeComponent },
	{ path: 'type/:id', component: TypeDetailComponent },
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

