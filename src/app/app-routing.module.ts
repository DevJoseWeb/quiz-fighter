import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JogoComponent } from './components';

export const routes: Routes = [
  { path: '', redirectTo: '/jogo', pathMatch: 'full' },
  { path: 'jogo', component: JogoComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
