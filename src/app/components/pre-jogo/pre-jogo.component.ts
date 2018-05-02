import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { AnimacaoService, PreJogoService } from '../../services';
import { Jogo } from '../../models';

@Component({
  selector: 'app-pre-jogo',
  templateUrl: './pre-jogo.component.html',
  styleUrls: ['./pre-jogo.component.css']
})
export class PreJogoComponent implements OnInit {

  constructor(
  	private router: Router,
  	private afAuth: AngularFireAuth,
    private animService: AnimacaoService,
    private preJogoService: PreJogoService) {}

  ngOnInit() {
    this.validarAutenticacao();
  	this.preJogoService.obterJogosDisponiveis();
  }

  validarAutenticacao() {
    this.afAuth.authState.subscribe(authState => {
      if (authState) {
        this.preJogoService.nomeJogador = authState.email.split('@')[0];
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  selecionarPersonagem(personagem: string) {
  	if (this.preJogoService.personagem) {
  		return;
  	}
  	this.preJogoService.selecionarPersonagem(personagem);
  }

  get personagem() {
    return this.preJogoService.personagem;
  }

  sair() {
    this.afAuth.auth.signOut();
  }

}
