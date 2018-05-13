import { Injectable } from '@angular/core';
import { 
	AngularFirestore, AngularFirestoreCollection 
} from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase';
import { Pergunta } from '../models';

@Injectable()
export class PerguntasService {

  private perguntasCollection: AngularFirestoreCollection<Pergunta>;
  readonly PERGUNTAS_COLLECTION: string = 'perguntas';

  constructor(
  	private afs: AngularFirestore) {
    this.perguntasCollection = this.afs.collection<Pergunta>(
      this.PERGUNTAS_COLLECTION);
  }

  obterPerguntas(): Observable<Pergunta[]> {
    return this.perguntasCollection.valueChanges();
  }

  restaurarPerguntas() {
  	this.removerTodasPerguntas();
  }

  async removerTodasPerguntas() {
  	const perguntas: firebase.firestore.QuerySnapshot = 
  		await this.afs.collection(this.PERGUNTAS_COLLECTION).ref.get();
  	const batch = this.afs.firestore.batch();
  	perguntas.forEach(pergunta => batch.delete(pergunta.ref));
  	batch.commit().then(res => this.adicionarPerguntas());
  }

  adicionarPerguntas() {
  	const perguntas = this.obterPerguntasExemplo();
  	for (let i in perguntas) {
  		const pergunta: Pergunta = {
  			id: null,
  			questao: perguntas[i].questao,
  			opcoes: perguntas[i].opcoes,
  			correta: perguntas[i].correta
  		}
  		this.perguntasCollection.add(pergunta);
  	}
  }

  obterPerguntasExemplo() {
  	return [
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
  }

}
