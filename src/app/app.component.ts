import { Component, AfterViewInit } from '@angular/core';

import * as Phaser from 'phaser/dist/phaser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  game: Phaser.Game;

  config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
    	key: 'principal',
        preload: this.preload,
        create: this.create
    }
  };

  ngAfterViewInit() {
  	this.game = new Phaser.Game(this.config);
  	console.log(this.game);
  }

  preload() {
  	const scene: Phaser.Scene = this;
  	console.log(scene);
  	scene.load.atlas('fairy_1', 'assets/spritesheet_1.png', 
  		'assets/sprites_1.json');
  }

  create() {
  	const scene: Phaser.Scene = this;

	const framesIdle = scene.anims.generateFrameNames('fairy_1', 
		{ end: 4, zeroPad: 3,prefix: '1_IDLE_'});
	scene.anims.create({
	    key: 'idle',
	    frames: framesIdle,
	    frameRate: 8,
	    repeat: -1,
	    onStart: (sprite) => { 
	    	sprite.originX = 0.5;
  			sprite.originY = 0.5;
	    }
	});

	const framesAttack = scene.anims.generateFrameNames('fairy_1', 
		{ end: 4, zeroPad: 3,prefix: '6_ATTACK_'});
	scene.anims.create({
	    key: 'attack',
	    frames: framesAttack,
	    frameRate: 8,
	    repeat: 0,
	    onStart: (sprite) => {
	  		sprite.originX = 0.25;
	  		sprite.originY = 0.53;
		},
	    onComplete: (sprite) => {
	  		sprite.play('idle');
		}
	});

	const fairy1 = scene.add.sprite(300, 300, 'fairy_1');
	console.log(fairy1);
	fairy1.scaleX = 0.5;
	fairy1.scaleY = 0.5;
	fairy1.play('idle');
  }

  atacar() {
  	this.game.scene.getScene('principal')
  		.children.getAt(0).play('attack');
  }
  
}
