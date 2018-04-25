import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
	AngularFirestore, 
	AngularFirestoreCollection, 
	AngularFirestoreDocument 
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import { AnimacaoService } from '../../services';
import { Jogo } from '../../models';

@Component({
  selector: 'app-pre-jogo',
  templateUrl: './pre-jogo.component.html',
  styleUrls: ['./pre-jogo.component.css']
})
export class PreJogoComponent implements OnInit {

  readonly JOGADOR_1 = 0;
  readonly NENHUMA_OPCAO_SEL = -1;
  readonly JOGOS_COLLECTION = 'jogos';
  readonly JOGOS_QTD_JOGADORES = 'qtdJogadores';
  readonly JOGO_DOCUMENT = 'jogo';

  personagem: string;
  jogos: Observable<Jogo[]>;
  jogo: Jogo;
  jogoDoc: AngularFirestoreDocument<Jogo>;
  nomeJogador: string;

  constructor(
  	public animService: AnimacaoService,
  	private router: Router,
  	private afs: AngularFirestore,
  	private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.validarAutenticacao();
  	this.obterJogosDisponiveis();
  }

  validarAutenticacao() {
    this.afAuth.authState.subscribe(authState => {
      if (authState) {
        this.nomeJogador = authState.email.split('@')[0];
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  obterJogosDisponiveis() {
    this.jogos = this.afs.collection<Jogo>(
      this.JOGOS_COLLECTION, 
      ref => ref.where(this.JOGOS_QTD_JOGADORES, '<=', 1))
    .valueChanges();
  }

  selecionarPersonagem(personagem: string) {
  	if (this.personagem) {
  		return;
  	}
  	this.personagem = personagem; 	
  	this.jogos.subscribe(jogos => {
  		if (jogos.length > 0 && !this.jogo) {
        //TODO iterar e obter o primeiro jogo disponível...
  			this.jogo = jogos[0];
  			this.iniciarJogo();
  		} 
  	});
  }

  iniciarJogo() {
    this.popularDadosJogo();
    this.atualizarDadosJogoFirebase();
  }

  popularDadosJogo() {
    const dadosJogador = { 
      nome: this.nomeJogador, 
      personagem: this.personagem 
    };
    if (this.jogo.qtdJogadores == 0) {
      this.jogo.jogador1 = dadosJogador;
    } else {
      this.jogo.jogador2 = dadosJogador;
      this.definirDadosPadraoJogo();
    }
    this.jogo.qtdJogadores++;
    this.jogo.dataAtualizacao = new Date().getTime();
  }

  definirDadosPadraoJogo() {
    this.jogo.vezJogar = this.JOGADOR_1;
    this.jogo.placar = {
      jogador1: { acertos: 0 }, 
      jogador2: { acertos: 0 }
    };
    this.jogo.questaoNum = 0;
    this.jogo.questaoSel = this.NENHUMA_OPCAO_SEL;
  }

  atualizarDadosJogoFirebase() {
    this.jogoDoc = this.afs.doc<Jogo>(
      this.JOGOS_COLLECTION + '/' + this.jogo.id);
    this.jogoDoc.update(this.jogo)
      .then(res => this.router.navigate(
        ['/' + this.JOGO_DOCUMENT + '/' + this.jogo.id]))
      .catch(err => console.log('TODO tratar erro aqui...')
    );
  }

}
