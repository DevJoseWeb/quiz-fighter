import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { 
  MatInputModule,
  MatButtonModule,
  MatListModule,
  MatSnackBarModule
} from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { 
  JogoComponent, LoginComponent, PreJogoComponent
} from './components';
import { AnimacaoService, PreJogoService } from './services';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    JogoComponent,
    LoginComponent,
    PreJogoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatSnackBarModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule
  ],
  providers: [
  	AnimacaoService,
    PreJogoService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
