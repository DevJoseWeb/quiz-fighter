import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AnimacaoService } from '../../services';

@Component({
  selector: 'app-pre-jogo',
  templateUrl: './pre-jogo.component.html',
  styleUrls: ['./pre-jogo.component.css']
})
export class PreJogoComponent implements OnInit {

  personagem: string;

  constructor(
  	public animService: AnimacaoService,
  	private router: Router) {}

  ngOnInit() {
  }

  selecionarPersonagem(personagem: string) {
  	if (this.personagem) {
  		return;
  	}
  	this.personagem = personagem;
  	sessionStorage['qf.jogador1'] = personagem;
  	setTimeout(() => this.router.navigate(['/jogo']), 1500);
  }

}
