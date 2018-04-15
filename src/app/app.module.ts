import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { 
  MatButtonModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { JogoComponent } from './components';
import { AnimacaoService } from './services';

@NgModule({
  declarations: [
    AppComponent,
    JogoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule
  ],
  providers: [
  	AnimacaoService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
