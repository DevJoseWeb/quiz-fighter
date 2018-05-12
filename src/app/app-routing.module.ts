import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
	PreJogoComponent, JogoComponent, LoginComponent, AdminComponent
} from './components';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'pre-jogo', component: PreJogoComponent },
  { path: 'jogo/:id', component: JogoComponent },
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
