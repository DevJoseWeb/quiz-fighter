import { 
  Component, AfterViewInit, OnInit, OnDestroy 
} from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { 
  AngularFirestore, AngularFirestoreDocument 
} from 'angularfire2/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AnimacaoService } from '../../services';
import { Jogo } from '../../models';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css']
})
export class JogoComponent implements AfterViewInit, 
    OnInit, OnDestroy {

  readonly MSG_CORRETA = 'Certa resposta!';
  readonly MSG_INCORRETA = 'Resposta incorreta.';
  readonly NUM_QUESTOES = 5;
  vezJogar: number;
  placar: any;
  questaoNum: number;
  questaoSel: number;
  perguntas: any;
  perguntaAtual: any;
  msgPopup: string;
  mostrarPopup: boolean;
  nomeJogador: string;
  jogoId: string;
  jogoDoc: AngularFirestoreDocument<Jogo>;
  jogoObserver: Observable<Jogo>;
  jogo: Jogo;
  aguardandoOponente: boolean;

  constructor(
  	private animacaoService: AnimacaoService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(authState => {
      if (!authState) { 
        this.router.navigate(['/']);
      }
    });
    this.jogoId = this.route.snapshot.paramMap.get('id');

  	this.vezJogar = 0; // jogador 1
  	this.placar = [
  		{ acertos: 0 }, 
  		{ acertos: 0 }
  	];
  	this.questaoNum = 0;
  	this.questaoSel = -1;
  	this.perguntas = this.obterPerguntas();
  	this.perguntaAtual = this.perguntas[this.questaoNum];

    this.aguardandoOponente = true;
    this.jogoDoc = this.afs.doc<Jogo>('jogos/' + this.jogoId);
    this.jogoObserver = this.jogoDoc.valueChanges();
  }

  ngAfterViewInit() {
    this.jogoObserver.subscribe(jogo => {
      console.log(JSON.stringify(jogo));
      if (jogo.qtdJogadores == 2 && !this.jogo) {
        this.jogo = jogo;
        this.iniciarJogo();
      }
    });
  }

  iniciarJogo() {
    this.animacaoService.iniciarAnimacao([
        this.jogo.jogador1.personagem, 
        this.jogo.jogador2.personagem,
      ], 5, 150, 
      this.jogo.jogador1.nome, 
      this.jogo.jogador2.nome
    );
    this.aguardandoOponente = false;
  }

  ngOnDestroy() {
    const canvas = document.getElementsByTagName('canvas');
    if (canvas.length > 0) {
      canvas[0].remove();
    }
  }

  selecionarOpcao(opcaoNum: number) {
  	this.questaoSel = opcaoNum;
  }

  confirmar(event: any) {
  	event.preventDefault();
  	if (this.perguntaAtual.correta == this.questaoSel) {
  		this.placar[this.vezJogar].acertos++;
  		this.msgPopup = this.MSG_CORRETA;
  		this.animacaoService.atacar(this.vezJogar);
  	} else {
  		this.msgPopup = this.MSG_INCORRETA;
  	}

  	if (this.placar[0].acertos == 5) 
  		this.msgPopup = 'JOGADOR 1 VENCEU!!!';
  	if (this.placar[1].acertos == 5) 
  		this.msgPopup = 'JOGADOR 2 VENCEU!!!';
  	this.exibirPopup();

  	this.vezJogar = (this.vezJogar == 0) ? 1 : 0;
  	this.questaoSel = -1;
  	this.perguntaAtual = this.perguntas[++this.questaoNum];
  }

  exibirPopup() {
  	this.mostrarPopup = true;
  }

  fecharPopup() {
  	this.mostrarPopup = false;
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
