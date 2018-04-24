
export interface Jogo {
	id: string;
	jogador1: { nome: string, personagem: string };
	jogador2: { nome: string, personagem: string };
	qtdJogadores: number;
	dataAtualizacao: number;
	vezJogar: number;
	placar: {
		jogador1: { acertos: number }, 
  		jogador2: { acertos: number }
  	};
  	questaoNum: number;
  	questaoSel: number;
  	questaoCorreta: boolean;
}
