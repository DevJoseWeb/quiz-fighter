import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
  	public afAuth: AngularFireAuth,
  	private router: Router) {}

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider())
      .then(value => this.router.navigate(['/jogo']))
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  loginEmail() {
    this.afAuth.auth
      .signInWithEmailAndPassword('email@email.com', '123456')
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  sair() {
    this.afAuth.auth.signOut();
  }

  ngOnInit() {
  	/*this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(
  'email@email.com', '123456').catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });*/
  }

}
