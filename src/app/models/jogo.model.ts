
export interface Jogo {
	id: string;
	jogador1: { nome: string, personagem: string };
	jogador2: { nome: string, personagem: string };
	qtdJogadores: number;
	dataAtualizacao: number;
}
