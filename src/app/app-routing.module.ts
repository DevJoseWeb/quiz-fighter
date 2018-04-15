import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JogoComponent, LoginComponent } from './components';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'jogo', component: JogoComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
