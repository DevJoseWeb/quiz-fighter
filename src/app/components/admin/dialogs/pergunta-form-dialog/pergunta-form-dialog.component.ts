import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';

import { Pergunta } from '../../../../models';

@Component({
  selector: 'app-pergunta-form-dialog',
  templateUrl: './pergunta-form-dialog.component.html',
  styleUrls: ['./pergunta-form-dialog.component.css']
})
export class PerguntaFormDialogComponent implements OnInit {

  pergunta: Pergunta;
  form: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PerguntaFormDialogComponent>) { }

  ngOnInit() {
  	this.gerarForm();
  }

  gerarForm() {
    this.form = this.fb.group({
      questao: ['', [ Validators.required ]],
      opcao1:  ['', [ Validators.required ]],
      opcao2:  ['', [ Validators.required ]],
      opcao3:  ['', [ Validators.required ]],
      opcao4:  ['', [ Validators.required ]],
      correta: ['', [ Validators.required ]]
    });
  }

  cadastrar() {
  	if (this.form.invalid) {
  		this.pergunta = null;
  	} else {
  		const dados: any = this.form.value;
  		const opcoes: Array<string> = [ 
  			dados.opcao1, 
  			dados.opcao2, 
  			dados.opcao3, 
  			dados.opcao4
  		];
  		this.pergunta = {
  			id: null,
  			questao: dados.questao,
  			opcoes: opcoes,
  			correta: dados.correta
  		};
  	}
  	this.dialogRef.close(this.pergunta);
  }

}
