import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { 
	MatTableDataSource, MatPaginator, 
	MatDialog, MatDialogRef, MAT_DIALOG_DATA 
} from '@angular/material';

import { PerguntasService } from '../../services';
import { Pergunta } from '../../models';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  colunas = ['pergunta', 'opcoes', 'correta'];
  dataSource: MatTableDataSource<Pergunta>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dialogRef: MatDialogRef<ConfirmarRestauracaoDialog>;

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
    this.dialogRef = this.dialog.open(ConfirmarRestauracaoDialog);

    this.dialogRef.afterClosed().subscribe(resposta => {
      if (resposta === 'S') {
      	this.perguntasService.restaurarPerguntas();
      }
    });
  }

}

@Component({
  selector: 'confirmar-restauracao-dados-dialog',
  template: `
  		<div style="text-align:center">
	  		<h3>Deseja restaurar todos os dados de perguntas?</h3>
	  		<button mat-raised-button 
	  		    (click)="fecharDialog('N')">
	  			Não
	  		</button>
	  		<button mat-raised-button color="primary"
	  			(click)="fecharDialog('S')">
	  			Sim
	  		</button>
	  	</div>`,
})
export class ConfirmarRestauracaoDialog {
  constructor(
    private dialogRef: MatDialogRef<ConfirmarRestauracaoDialog>) {}

  fecharDialog(resposta: string) {
  	this.dialogRef.close(resposta);
  }
}
