import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { JogoComponent } from './components';
import { AnimacaoService } from './services';

@NgModule({
  declarations: [
    AppComponent,
    JogoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
  	AnimacaoService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
