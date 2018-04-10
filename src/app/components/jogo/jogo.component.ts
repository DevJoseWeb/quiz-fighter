import { Component, AfterViewInit, OnInit } from '@angular/core';

import { AnimacaoService } from '../../services';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css']
})
export class JogoComponent implements AfterViewInit, OnInit {

  readonly NUM_QUESTOES: number = 5;
  jogadores: any;
  vezJogar: number;
  placar: any;
  questaoNum: number;
  questaoSel: number;
  perguntas: any;
  perguntaAtual: any;

  constructor(
  	private animacaoService: AnimacaoService) {}

  ngOnInit() {
  	this.jogadores = [
  		{ nome: 'Jogador 1' },
  		{ nome: 'Jogador 2' }
  	];
  	this.vezJogar = 0; // jogador 1
  	this.placar = [
  		{ acertos: 0 }, 
  		{ acertos: 0 }
  	];
  	this.questaoNum = 0;
  	this.questaoSel = -1;
  	this.perguntas = this.obterPerguntas();
  	this.perguntaAtual = this.perguntas[this.questaoNum];
  }

  ngAfterViewInit() {
  	const avatares = [
  		this.animacaoService.P_ARQUEIRA,
  		this.animacaoService.P_ELFO_AZUL,
  		this.animacaoService.P_ELFO_VERDE,
  		this.animacaoService.P_FADA_VERMELHA
  	];
  	this.animacaoService.iniciarAnimacao([
  			avatares[Math.floor(Math.random() * 4)], 
  			avatares[Math.floor(Math.random() * 4)]
  		], 5, 150);
  }

  selecionarOpcao(opcaoNum: number) {
  	this.questaoSel = opcaoNum;
  }

  confirmar(event: any) {
  	event.preventDefault();
  	if (this.perguntaAtual.correta == this.questaoSel) {
  		this.placar[this.vezJogar].acertos++;
  		alert('CERTA RESPOSTA!!!');
  		this.animacaoService.atacar(this.vezJogar);
  	} else {
  		alert('RESPOSTA INCORRETA...');
  	}

  	if (this.placar[0].acertos == 5) 
  		alert('JOGADOR 1 VENCEU, FINISH HIM!!!');
  	if (this.placar[1].acertos == 5) 
  		alert('JOGADOR 2 VENCEU, FINISH HIM!!!'); 

  	this.vezJogar = (this.vezJogar == 0) ? 1 : 0;
  	this.questaoSel = -1;
  	this.perguntaAtual = this.perguntas[++this.questaoNum];
  }

  selecionado(index: number) {
  	return index == this.questaoSel;
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
  	questoes.sort(() => 0.5 - Math.random());
  	return questoes;
  }

}
