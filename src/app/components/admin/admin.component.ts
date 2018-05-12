import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { 
	MatTableDataSource, MatPaginator 
} from '@angular/material';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  colunas = ['pergunta'];
  dataSource: MatTableDataSource<string[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
  	private afAuth: AngularFireAuth,
  	private router: Router) { }

  ngOnInit() {
    this.validarAutenticacao();
    let perguntas = [];
    for (let i=1; i<=100; i++) {
    	perguntas.push('Como se diz "vermelho" em inglês? ' + i);
    }
    this.dataSource = new MatTableDataSource<string[]>(perguntas);
    this.dataSource.paginator = this.paginator;
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

}
