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

  readonly MSG_CORRETA   = 'Certa resposta!';
  readonly MSG_INCORRETA = 'Resposta incorreta.';
  readonly NUM_QUESTOES  = 5;
  readonly JOGADOR_1 = 0;
  readonly JOGADOR_2 = 1;

  perguntaAtual: any;
  perguntas: any;
  mostrarPopup: boolean;
  msgPopup: string;
  
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

  	this.perguntas = this.obterPerguntas();
  	this.perguntaAtual = this.perguntas[0];
    this.aguardandoOponente = true;
    this.jogoDoc = this.afs.doc<Jogo>('jogos/' + this.jogoId);
    this.jogoObserver = this.jogoDoc.valueChanges();
  }

  ngAfterViewInit() {
    this.jogoObserver.subscribe(jogo => {
      console.log("NOVO STREAM DE JOGO UPDATED...")
      console.log(JSON.stringify(jogo));
      if (this.jogo) {
        console.log('Atualizando status do jogo...');
        this.jogo = jogo;
        this.atualizarJogo();
      }
      if (jogo.qtdJogadores == 2 && !this.jogo) {
        this.jogo = jogo;
        this.iniciarAnimacao();
      }
    });
  }

  iniciarAnimacao() {
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
  	this.jogo.questaoSel = opcaoNum;
    //TODO atualizar entidade aqui ???
  }

  confirmar(event: any) {
  	event.preventDefault();
  	if (this.perguntaAtual.correta == this.jogo.questaoSel) {
      if (this.jogo.vezJogar == this.JOGADOR_1) {
  		  this.jogo.placar.jogador1.acertos++;
      } else {
        this.jogo.placar.jogador2.acertos++;
      }
  		this.msgPopup = this.MSG_CORRETA;
  		this.animacaoService.atacar(this.jogo.vezJogar);
  	} else {
  		this.msgPopup = this.MSG_INCORRETA;
  	}

  	if (this.jogo.placar.jogador1.acertos == 5) {
  		this.msgPopup = this.jogo.jogador1.nome + ' venceu!';
    }
  	if (this.jogo.placar.jogador2.acertos == 5) {
  		this.msgPopup = this.jogo.jogador2.nome + ' venceu!';
    }
  	this.exibirPopup();

  	this.jogo.vezJogar = (this.jogo.vezJogar == this.JOGADOR_1) ? 
      this.JOGADOR_2 : this.JOGADOR_1;
    this.jogo.questaoCorreta = (
      this.perguntaAtual.correta == this.jogo.questaoSel);
  	this.jogo.questaoSel = -1;
  	this.perguntaAtual = this.perguntas[++this.jogo.questaoNum];
    this.jogoDoc.update(this.jogo);
  }

  atualizarJogo() {
    if (this.jogo.questaoCorreta) {
      this.msgPopup = this.MSG_CORRETA;
      const jogadorAnterior = (this.jogo.vezJogar == this.JOGADOR_1) ? 
        this.JOGADOR_2 : this.JOGADOR_1;
      this.animacaoService.atacar(jogadorAnterior);
    } else {
      this.msgPopup = this.MSG_INCORRETA;
    }
    if (this.jogo.placar.jogador1.acertos == 5) {
      this.msgPopup = this.jogo.jogador1.nome + ' venceu!';
    }
    if (this.jogo.placar.jogador2.acertos == 5) {
      this.msgPopup = this.jogo.jogador2.nome + ' venceu!';
    }
    this.exibirPopup();
    this.perguntaAtual = this.perguntas[this.jogo.questaoNum];
  }

  exibirPopup() {
  	this.mostrarPopup = true;
  }

  fecharPopup() {
  	this.mostrarPopup = false;
  }

  selecionado(index: number) {
  	return index == this.jogo.questaoSel;
  }

  get questaoSel() {
    if (!this.jogo) {
      return -1;
    }
    return this.jogo.questaoSel;
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
