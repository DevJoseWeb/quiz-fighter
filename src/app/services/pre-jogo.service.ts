import { Injectable } from '@angular/core';
import { 
	AngularFirestore, 
	AngularFirestoreCollection, 
	AngularFirestoreDocument ,
  DocumentChangeAction
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Jogo, Pergunta } from '../models';
import { PerguntasService } from '../services/perguntas.service';

@Injectable()
export class PreJogoService {

  readonly JOGADOR_1 = 0;
  readonly NENHUMA_OPCAO_SEL = -1;
  readonly JOGOS_COLLECTION = 'jogos/';
  readonly JOGOS_QTD_JOGADORES = 'qtdJogadores';
  readonly JOGO_DOCUMENT = '/jogo/';
  readonly NUM_QUESTOES_JOGO = 5;
  readonly SNACKBAR_DURATION: any = { duration: 5000 };

  personagem: string;
  jogos: Observable<DocumentChangeAction[]>;
  jogoId: string;
  jogo: Jogo;
  jogoDoc: AngularFirestoreDocument<Jogo>;
  nomeJogador: string;

  constructor(
  	private afs: AngularFirestore,
  	private router: Router,
    private perguntasService: PerguntasService,
    private snackBar: MatSnackBar) {}

  obterJogosDisponiveis() {
    this.jogos = this.afs.collection<Jogo>(
      this.JOGOS_COLLECTION, 
      ref => ref.where(this.JOGOS_QTD_JOGADORES, '<=', 1)
                .orderBy(this.JOGOS_QTD_JOGADORES, "desc"))
    .snapshotChanges();
  }

  selecionarPersonagem(personagem: string) {
    this.personagem = personagem;
    this.jogo = null; // necessário para um segundo jogo
    this.jogos.subscribe((jogosDoc: DocumentChangeAction[]) => {
      for (let i in jogosDoc) {
        if (!this.jogo) {
          this.selecionarJogo(jogosDoc[i]);
        }
      } 
    });
  }

  selecionarJogo(jogoDoc: DocumentChangeAction) {
    const jogo = jogoDoc.payload.doc;
    this.jogoId = jogo.id;
    this.jogo = jogo.data() as Jogo;
    this.iniciarJogo();
  }

  iniciarJogo() {
    if (this.jogo.qtdJogadores == 0) {
      this.iniciarJogoJogador1();
    } else {
      this.iniciarJogoJogador2();
    }
  }

  iniciarJogoJogador1() {
    this.popularDadosJogoJogador1();
    this.atualizarDadosJogoFirebase();
  }

  popularDadosJogoJogador1() {
    this.jogo.dataAtualizacao = new Date().getTime();
    this.jogo.jogador1 = { 
      nome: this.nomeJogador, 
      personagem: this.personagem 
    };
    this.jogo.qtdJogadores++;
  }

  iniciarJogoJogador2() {
    this.perguntasService.obterPerguntas()
      .subscribe(
        perguntas => {
          this.popularDadosJogoJogador2(perguntas);
          this.atualizarDadosJogoFirebase();
        },
        err => this.snackBar.open(
          'Erro ao iniciar o jogo, tente novamente.', 
          'Erro', this.SNACKBAR_DURATION)
      );
  }

  popularDadosJogoJogador2(perguntas: Pergunta[]) {
    this.jogo.dataAtualizacao = new Date().getTime();
    //caso jogador1 seja o mesmo da seleção vai para a espera do adversário
    if (this.jogo.jogador1.nome == this.nomeJogador) {
      this.jogo.jogador1.personagem = this.personagem;
      return;
    }
    this.jogo.jogador2 = { 
      nome: this.nomeJogador, 
      personagem: this.personagem 
    };
    this.definirDadosPadraoJogo();
    this.popularQuestoes(perguntas);
    this.jogo.qtdJogadores++;
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

  popularQuestoes(perguntas:Pergunta[]) {
    this.jogo.questoes = [];
    const questoesPos: Array<number> = [];
    while (this.jogo.questoes.length < this.NUM_QUESTOES_JOGO) {
      const posicao = this.obterNumeroAleatorio(perguntas.length);
      if (questoesPos.indexOf(posicao) == -1) {
        questoesPos.push(posicao);
        this.jogo.questoes.push(perguntas[posicao]);
      }
    }
  }

  obterNumeroAleatorio(max: number) {
    return Math.floor(Math.random() * max);
  }

  atualizarDadosJogoFirebase() {
    this.personagem = null;
    const jogosCollectionUrl = this.JOGOS_COLLECTION + this.jogoId;
    const jogoUrl = this.JOGO_DOCUMENT + this.jogoId;
    this.afs
      .doc<Jogo>(jogosCollectionUrl)
      .update(this.jogo)
        .then(res => this.router.navigate([jogoUrl]))
        .catch(err => this.snackBar.open(
          'Erro ao iniciar o jogo, tente novamente.', 
          'Erro', this.SNACKBAR_DURATION));
  }

}
