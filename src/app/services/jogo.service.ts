import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { 
  AngularFirestore, AngularFirestoreDocument 
} from 'angularfire2/firestore';

import { Jogo } from '../models';
import { AnimacaoService } from './animacao.service';

@Injectable()
export class JogoService {

  readonly MSG_CORRETA   = 'Certa resposta!';
  readonly MSG_INCORRETA = 'Resposta incorreta.';
  readonly MSG_VENCEU = ' venceu.';
  readonly NUM_QUESTOES  = 5;
  readonly QTD_PONTOS_TOTAIS  = 150;
  readonly JOGADOR_1 = 0;
  readonly JOGADOR_2 = 1;
  readonly NENHUMA_SELECAO = -1;
  readonly JOGOS_DOC_PATH = 'jogos/';

  perguntaAtual: any;
  perguntas: any;
  msgPopup: string;
  aguardandoOponente: boolean;
  mostrarPopup: boolean;
  nomeJogador: string;
  fimJogo: boolean;
  jogoDoc: AngularFirestoreDocument<Jogo>;
  jogoObserver: Observable<Jogo>;
  jogo: Jogo;

  constructor(
  	private afs: AngularFirestore,
  	private animacaoService: AnimacaoService,
  	private afAuth: AngularFireAuth) {}

  iniciarRecursos(jogoId: string) {
  	this.aguardandoOponente = true;
  	this.mostrarPopup = false;
  	this.fimJogo = false;
  	this.perguntas = this.obterPerguntas();
  	this.perguntaAtual = this.perguntas[0];
    this.jogoDoc = this.afs.doc<Jogo>(this.JOGOS_DOC_PATH + jogoId);
    this.jogoObserver = this.jogoDoc.valueChanges();
  }

  iniciarJogo() {
  	this.obterNomeJogador();
    this.jogoObserver.subscribe(jogo => {
      if (this.fimJogo) {
      	return;
      }
   	  if (this.jogo) {
        this.jogo = jogo;
        this.atualizarJogo();
        this.mostrarPopup = true;
      }
      if (jogo.qtdJogadores == 2 && !this.jogo) {
        this.jogo = jogo;
        this.iniciarAnimacao();
        this.aguardandoOponente = false;
      }
    });
  }

  obterNomeJogador() {
  	this.afAuth.authState.subscribe(authState => {
  	  if (authState) {
        this.nomeJogador = authState.email.split('@')[0];
      }
    });
  }

  iniciarAnimacao() {
    this.animacaoService.iniciarAnimacao([
        this.jogo.jogador1.personagem, 
        this.jogo.jogador2.personagem,
      ], 
      this.NUM_QUESTOES, 
      this.QTD_PONTOS_TOTAIS, 
      this.jogo.jogador1.nome, 
      this.jogo.jogador2.nome
    );
  }

  atualizarJogo() {
    if (this.jogo.questaoCorreta) {
      this.msgPopup = this.MSG_CORRETA;
      this.animacaoService.atacar(this.obterJogadorAnterior());
    } else {
      this.msgPopup = this.MSG_INCORRETA;
    }
    this.verificarFimJogo();
    this.perguntaAtual = this.perguntas[this.jogo.questaoNum];
  }

  obterJogadorAnterior(): number {
  	let jogadorAnterior: number = this.JOGADOR_1;
  	if (this.jogo.vezJogar == this.JOGADOR_1) {
      jogadorAnterior = this.JOGADOR_2;
  	}
  	return jogadorAnterior;
  }

  verificarFimJogo() {
  	if (this.jogador1Venceu()) {
      this.msgPopup = this.jogo.jogador1.nome + this.MSG_VENCEU;
      this.fimJogo = true;
    }
    if (this.jogador2Venceu()) {
      this.msgPopup = this.jogo.jogador2.nome + this.MSG_VENCEU;
      this.fimJogo = true;
    }
    if (this.fimJogo) {
	    this.jogo.vezJogar = this.JOGADOR_1;
	    this.jogo.placar = {
	      jogador1: { acertos: 0 }, 
	      jogador2: { acertos: 0 }
	    };
	    this.jogo.questaoNum = 0;
	    this.jogo.questaoSel = this.NENHUMA_SELECAO;
	    this.jogo.qtdJogadores = 0;
	    this.jogoDoc.update(this.jogo);
    }
  }

  jogador1Venceu(): boolean {
  	return (this.jogo.placar.jogador1.acertos == this.NUM_QUESTOES);
  }

  jogador2Venceu(): boolean {
  	return (this.jogo.placar.jogador2.acertos == this.NUM_QUESTOES);
  }

  aguardarJogadaAdversario(): boolean {
  	if (!this.nomeJogador || !this.jogo) {
  		return false;
  	}
  	let jogLocal: number = this.JOGADOR_1;
  	if (this.jogo.jogador2.nome == this.nomeJogador) {
  		jogLocal = this.JOGADOR_2;
  	}
  	return jogLocal != this.jogo.vezJogar;
  }

  confirmar() {
  	if (this.fimJogo) {
  		return;
  	}
  	this.jogo.questaoCorreta = this.verificarQuestaoCorreta();
  	if (this.jogo.questaoCorreta) {
      this.atualizarPlacar();
  	  this.animacaoService.atacar(this.jogo.vezJogar);
  	}
  	this.atualizarVezJogar();
  	this.jogo.questaoSel = this.NENHUMA_SELECAO;
  	this.perguntaAtual = this.perguntas[++this.jogo.questaoNum];
    this.jogoDoc.update(this.jogo);
  }

  verificarQuestaoCorreta(): boolean {
  	return (this.perguntaAtual.correta == this.jogo.questaoSel);
  }

  atualizarPlacar() {
  	if (this.jogo.vezJogar == this.JOGADOR_1) {
  		this.jogo.placar.jogador1.acertos++;
    } else {
        this.jogo.placar.jogador2.acertos++;
    }
  }

  atualizarVezJogar() {
  	switch (this.jogo.vezJogar) {
  		case this.JOGADOR_1:
  			this.jogo.vezJogar = this.JOGADOR_2;
  			break;
  		case this.JOGADOR_2:
  			this.jogo.vezJogar = this.JOGADOR_1;
  			break;
  	}
  }

  obterPerguntas() {
  	let questoes = [
  		{ 
  			questao: 'Como se diz "azul" em inglês?',
  			opcoes: ['Black', 'Blue', 'Green', 'Purple'],
  			correta: 1
  		},
  		{ 
  			questao: 'Como se diz "verde" em inglês?',
  			opcoes: ['Green', 'Blue', 'Black', 'Purple'],
  			correta: 0
  		},
  		{ 
  			questao: 'Como se diz "preto" em inglês?',
  			opcoes: ['Pink', 'Blue', 'Black', 'Purple'],
  			correta: 2
  		},
  		{ 
  			questao: 'Como se diz "vermelho" em inglês?',
  			opcoes: ['Black', 'Blue', 'Red', 'Purple'],
  			correta: 2
  		},
  		{ 
  			questao: 'Como se diz "amarelo" em inglês?',
  			opcoes: ['Green', 'Blue', 'Black', 'Yellow'],
  			correta: 3
  		},
  		{ 
  			questao: 'Como se diz "branco" em inglês?',
  			opcoes: ['White', 'Blue', 'Black', 'Purple'],
  			correta: 0
  		},
  		{ 
  			questao: 'Como se diz "cinza" em inglês?',
  			opcoes: ['Green', 'Gray', 'Black', 'Purple'],
  			correta: 1
  		},
  		{ 
  			questao: 'Como se diz "Roxo" em inglês?',
  			opcoes: ['Green', 'Blue', 'Black', 'Purple'],
  			correta: 3
  		},
  		{ 
  			questao: 'Como se diz "Rosa" em inglês?',
  			opcoes: ['Green', 'Blue', 'Pink', 'Purple'],
  			correta: 2
  		},
  		{ 
  			questao: 'Como se diz "laranja" em inglês?',
  			opcoes: ['Green', 'Blue', 'Black', 'Orange'],
  			correta: 3
  		},
  		{ 
  			questao: 'Como se diz "azul" em inglês?',
  			opcoes: ['Green', 'Blue', 'Black', 'Purple'],
  			correta: 1
  		},
  		{ 
  			questao: 'Como se diz "verde" em inglês?',
  			opcoes: ['Green', 'Blue', 'Black', 'Purple'],
  			correta: 0
  		},
  		{ 
  			questao: 'Como se diz "preto" em inglês?',
  			opcoes: ['Green', 'Blue', 'Black', 'Purple'],
  			correta: 2
  		},
  		{ 
  			questao: 'Como se diz "vermelho" em inglês?',
  			opcoes: ['Green', 'Blue', 'Red', 'Purple'],
  			correta: 2
  		},
  		{ 
  			questao: 'Como se diz "amarelo" em inglês?',
  			opcoes: ['Green', 'Blue', 'Black', 'Yellow'],
  			correta: 3
  		},
  		{ 
  			questao: 'Como se diz "branco" em inglês?',
  			opcoes: ['White', 'Blue', 'Black', 'Purple'],
  			correta: 0
  		},
  		{ 
  			questao: 'Como se diz "cinza" em inglês?',
  			opcoes: ['Green', 'Gray', 'Black', 'Purple'],
  			correta: 1
  		},
  		{ 
  			questao: 'Como se diz "Roxo" em inglês?',
  			opcoes: ['Green', 'Blue', 'Black', 'Purple'],
  			correta: 3
  		},
  		{ 
  			questao: 'Como se diz "Rosa" em inglês?',
  			opcoes: ['Green', 'Blue', 'Pink', 'Purple'],
  			correta: 2
  		},
  		{ 
  			questao: 'Como se diz "laranja" em inglês?',
  			opcoes: ['Green', 'Blue', 'Black', 'Orange'],
  			correta: 3
  		}
  	];
  	//questoes.sort(() => 0.5 - Math.random());
  	return questoes;
  }

}
