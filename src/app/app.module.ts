import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import { 
  MatInputModule,
  MatButtonModule,
  MatListModule,
  MatSnackBarModule,
  MatTableModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSelectModule,
  MatIconModule,
  MatTooltipModule,
  MatSlideToggleModule
} from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { 
  JogoComponent, 
  LoginComponent, 
  PreJogoComponent, 
  AdminComponent, 
  ConfirmarRestauracaoDialogComponent, 
  PerguntaFormDialogComponent,
  JogosFormDialogComponent,
  ConfirmarRemoverDialogComponent
} from './components';
import { 
  AnimacaoService, 
  PreJogoService, 
  JogoService, 
  PerguntasService,
  Jogador1StrategyService,
  Jogador2StrategyService 
} from './services';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    JogoComponent,
    LoginComponent,
    PreJogoComponent,
    AdminComponent,
    ConfirmarRestauracaoDialogComponent,
    PerguntaFormDialogComponent,
    JogosFormDialogComponent,
    ConfirmarRemoverDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule
  ],
  providers: [
  	AnimacaoService,
    PreJogoService,
    JogoService,
    PerguntasService,
    Jogador1StrategyService,
    Jogador2StrategyService
  ],
  entryComponents: [ 
    ConfirmarRestauracaoDialogComponent,
    PerguntaFormDialogComponent,
    JogosFormDialogComponent,
    ConfirmarRemoverDialogComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
