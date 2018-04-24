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
  personagem: string;
  jogos: Observable<Jogo[]>;
  jogo: Jogo;
  nomeJogador: string;

  constructor(
  	public animService: AnimacaoService,
  	private router: Router,
  	private afs: AngularFirestore,
  	private afAuth: AngularFireAuth) {}

  ngOnInit() {
  	this.afAuth.authState.subscribe(authState => {
      if (authState) { 
        this.nomeJogador = authState.email.split('@')[0];
      } else {
        this.router.navigate(['/']);
      }
    });
  	this.jogos = this.afs.collection<Jogo>('jogos', 
  		ref => ref.where('qtdJogadores', '<=', 1))
  		.valueChanges();
  }

  selecionarPersonagem(personagem: string) {
  	if (this.personagem) {
  		return;
  	}
  	this.personagem = personagem; 	
  	this.jogos.subscribe(jogos => {
  		console.log(jogos.length);
  		if (jogos.length > 0 && !this.jogo) {
  			console.log('Encontrado jogo: ' + JSON.stringify(jogos[0]));
  			this.jogo = jogos[0];
  			this.iniciarJogo();
  		} 
  	});
  }

  iniciarJogo() {
  	console.log('iniciarJogo...');
  	console.log(JSON.stringify(this.jogo));
  	const dadosJogador = { 
		nome: this.nomeJogador, 
		personagem: this.personagem 
	};
  	if (this.jogo.qtdJogadores == 0) {
  		this.jogo.jogador1 = dadosJogador;
  	} else {
  		this.jogo.jogador2 = dadosJogador;
      this.jogo.vezJogar = this.JOGADOR_1;
      this.jogo.placar = {
        jogador1: { acertos: 0 }, 
        jogador2: { acertos: 0 }
      };
      this.jogo.questaoNum = 0;
      this.jogo.questaoSel = this.NENHUMA_OPCAO_SEL;
  	}

  	this.jogo.qtdJogadores++;
  	this.jogo.dataAtualizacao = new Date().getTime();
  	console.log(JSON.stringify(this.jogo));

  	const jogoDoc: AngularFirestoreDocument<Jogo> = 
  		this.afs.doc<Jogo>('jogos/' + this.jogo.id);
  	jogoDoc.update(this.jogo)
  		.then(res => this.router.navigate(['/jogo/' + this.jogo.id]));
  }

}
