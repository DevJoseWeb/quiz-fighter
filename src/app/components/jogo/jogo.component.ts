import { Component, AfterViewInit } from '@angular/core';

import { AnimacaoService } from '../../services';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css']
})
export class JogoComponent implements AfterViewInit {

  constructor(
  	private animacaoService: AnimacaoService) {}

  ngAfterViewInit() {
  	const jogadores = [
  		this.animacaoService.P_ARQUEIRA,
  		this.animacaoService.P_ELFO_AZUL,
  		this.animacaoService.P_ELFO_VERDE,
  		this.animacaoService.P_FADA_VERMELHA
  	];
  	this.animacaoService.iniciarAnimacao([
  			jogadores[Math.floor(Math.random() * 4)], 
  			jogadores[Math.floor(Math.random() * 4)]
  		], 5);
  }

  atacar(jogador: number) {
  	this.animacaoService.atacar(jogador);
  }

}
