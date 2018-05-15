import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { 
	MatTableDataSource, MatPaginator, MatDialog, MatDialogRef 
} from '@angular/material';

import { PerguntasService } from '../../services';
import { Pergunta } from '../../models';
import { 
  ConfirmarRestauracaoDialogComponent,
  PerguntaFormDialogComponent
} from './dialogs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  colunas = ['pergunta', 'opcoes', 'correta', 'acao'];
  dataSource: MatTableDataSource<Pergunta>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dialogRestaurarRef: MatDialogRef<ConfirmarRestauracaoDialogComponent>;
  dialogPerguntaRef: MatDialogRef<PerguntaFormDialogComponent>;

  constructor(
  	private afAuth: AngularFireAuth,
  	private router: Router,
  	private dialog: MatDialog,
  	private perguntasService: PerguntasService) { }

  ngOnInit() {
    this.validarAutenticacao();
    this.perguntasService.obterPerguntas()
      .subscribe(perguntas => {
    	  this.dataSource = new MatTableDataSource<Pergunta>(perguntas);
    	  this.dataSource.paginator = this.paginator;
      });
  }

  validarAutenticacao() {
    this.afAuth.authState.subscribe(authState => {
      if (!authState) {
        this.router.navigate(['/']);
      }
    });
  }

  sair() {
    this.afAuth.auth.signOut();
  }

  confirmarRestauracaoDados() {
    this.dialogRestaurarRef = this.dialog.open(
      ConfirmarRestauracaoDialogComponent);

    this.dialogRestaurarRef.afterClosed().subscribe(resposta => {
      if (resposta) {
      	this.perguntasService.restaurarPerguntas();
      }
    });
  }

  cadastrar() {
    this.dialogPerguntaRef = this.dialog.open(
      PerguntaFormDialogComponent);

    this.dialogPerguntaRef.afterClosed().subscribe(data => {
      if (data) {
        this.perguntasService.cadastrar(data.pergunta);
      }
    });
  }

  atualizar($event: any, pergunta: Pergunta) {
    $event.preventDefault();
    this.dialogPerguntaRef = this.dialog.open(
      PerguntaFormDialogComponent, 
      { data: { pergunta: pergunta } }
    );

    this.dialogPerguntaRef.afterClosed().subscribe(data => {
      if (data) {
        this.perguntasService.atualizar(data.pergunta, data.id);
      }
    });
  }

  remover($event: any, perguntaId: string) {
    $event.preventDefault();
    this.perguntasService.remover(perguntaId);
  }

}