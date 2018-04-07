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
    width: 400,
    height: 200, // 550(total) - 200(Jogo) = 350(Principal)
    scene: {
    	key: 'principal',
        preload: this.preload,
        create: this.create,
        update: this.update
    }
  };

  ngAfterViewInit() {
  	this.game = new Phaser.Game(this.config);
  	console.log(this.game);
  }

  preload() {
  	const scene: Phaser.Scene = this;
  	console.log(scene);

  	const backgrounds = [
  		'assets/background1.png',
  		'assets/background2.png',
  		'assets/background3.png',
  		'assets/background4.png'
  	];
  	const backgroundIndex = Math.floor(
  		Math.random() * backgrounds.length);
  	scene.load.image('background', backgrounds[backgroundIndex]);

  	scene.load.audioSprite('attack', 'assets/audio/attack.mp3');
  	scene.load.audioSprite('end', 'assets/audio/end.wav');

  	scene.load.atlas(
  		'fada-vermelha', 
  		'assets/spritesheet-fada-vermelha.png', 
  		'assets/sprites-fada-vermelha.json'
  	);
  	scene.score = [
  		{ jogador1: { pontos: 150, forca: 28 }}, 
  		{ jogador2: { pontos: 150, forca: 50 }}
  	];
  }

  create() {
  	const scene: Phaser.Scene = this;
  	scene.add.image(0, 0, 'background').setOrigin(0, 0).setAlpha(0.7);
  	scene.sound.add('attack');
  	scene.sound.add('end');

	const framesIdle = scene.anims.generateFrameNames('fada-vermelha', 
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

	const framesAttack = scene.anims.generateFrameNames('fada-vermelha', 
		{ end: 4, zeroPad: 3,prefix: '2_ATTACK_'});
	scene.anims.create({
	    key: 'attack',
	    frames: framesAttack,
	    frameRate: 8,
	    repeat: 0,
	    onStart: (sprite) => {
	  		sprite.originX = 0.25;
		},
	    onComplete: (sprite) => {
	    	const scene: Phaser.Scene = this;
	    	scene.sound.play('attack');
	    	sprite.play('idle');
	    	if (sprite.scaleX > 0) {
	    		const jogador2 = scene.children.list.filter(sprite => 
  					(sprite instanceof Phaser.GameObjects.Sprite 
  					&& sprite.scaleX < 0))[0];
	    		scene.score[1].jogador2.pontos -= scene.score[0].jogador1.forca;
	    		if (scene.score[1].jogador2.pontos <= 0) {
	    			jogador2.play('die');
	    		} else {
	    			jogador2.play('hurt');
	    		}
	    	} else {
	    		const jogador1 = scene.children.list.filter(sprite => 
  					(sprite instanceof Phaser.GameObjects.Sprite 
  					&& sprite.scaleX > 0))[0];
	    		scene.score[0].jogador1.pontos -= scene.score[1].jogador2.forca;
	    		if (scene.score[0].jogador1.pontos <= 0) {
	    			jogador1.play('die');
	    		} else {
	    			jogador1.play('hurt');
	    		}
	    	}
		}
	});

	const framesHurt = scene.anims.generateFrameNames('fada-vermelha', 
		{ end: 4, zeroPad: 3,prefix: '3_HURT_'});
	scene.anims.create({
	    key: 'hurt',
	    frames: framesHurt,
	    frameRate: 8,
	    repeat: 0,
	    onStart: (sprite) => {
	  		sprite.originX = 0.6;
		},
	    onComplete: (sprite) => {
	  		sprite.play('idle');
		}
	});

	const framesDie = scene.anims.generateFrameNames('fada-vermelha', 
		{ end: 4, zeroPad: 3,prefix: '4_DIE_'});
	scene.anims.create({
	    key: 'die',
	    frames: framesDie,
	    frameRate: 8,
	    repeat: 0,
	    onComplete: () => {
	    	const scene: Phaser.Scene = this;
	    	scene.sound.play('end');
		}
	});

	const jogador1 = scene.add.sprite(90, 110, 'fada-vermelha');
	jogador1.play('idle');
	console.log(jogador1);

	const jogador2 = scene.add.sprite(310, 110, 'fada-vermelha');
	jogador2.scaleX *= -1;
	jogador2.play('idle');

	const graphics = scene.add.graphics({ 
		lineStyle: { width: 1, color: 0x000000 }, 
		fillStyle: { color: 0x00FF00 } 
	});
  }

  update() {
  	const scene: Phaser.Scene = this;
  	const graphics = scene.children.list.filter(child => 
  		child instanceof Phaser.GameObjects.Graphics)[0];

	graphics.clear();

	const barraVidaJog1 = new Phaser.Geom.Rectangle();
	barraVidaJog1.x = 10;
	barraVidaJog1.y = 10;
	barraVidaJog1.width = (scene.score[0].jogador1.pontos >= 0) ? 
		scene.score[0].jogador1.pontos : 0;
	barraVidaJog1.height = 12;
	graphics.fillRectShape(barraVidaJog1);

	const bordaVidaJog1 = new Phaser.Geom.Rectangle();
	bordaVidaJog1.x = 10;
	bordaVidaJog1.y = 10;
	bordaVidaJog1.width = 150;
	bordaVidaJog1.height = 12;
	graphics.strokeRectShape(bordaVidaJog1);

	const barraVidaJog2 = new Phaser.Geom.Rectangle();
	barraVidaJog2.x = 240 + (150 - scene.score[1].jogador2.pontos);
	barraVidaJog2.y = 10;
	barraVidaJog2.width = (scene.score[1].jogador2.pontos >= 0) ? 
		scene.score[1].jogador2.pontos : 0;
	barraVidaJog2.height = 12;
	graphics.fillRectShape(barraVidaJog2);

	const bordaVidaJog2 = new Phaser.Geom.Rectangle();
	bordaVidaJog2.x = 240;
	bordaVidaJog2.y = 10;
	bordaVidaJog2.width = 150;
	bordaVidaJog2.height = 12;
	graphics.strokeRectShape(bordaVidaJog2);
  }

  atacar(jogador: number) {
  	const scene = this.game.scene.getScene('principal');
  	const jogador1 = scene.children.list.filter(sprite => 
  		(sprite instanceof Phaser.GameObjects.Sprite 
  			&& sprite.scaleX > 0))[0];
  	const jogador2 = scene.children.list.filter(sprite => 
  		(sprite instanceof Phaser.GameObjects.Sprite 
  			&& sprite.scaleX < 0))[0];
  	if (jogador == 1) {
	  	jogador1.depth = 2;
	  	jogador2.depth = 1;
	  	jogador1.play('attack');
	} else {
		jogador1.depth = 1;
	  	jogador2.depth = 2;
	  	jogador2.play('attack');
	}
  }
  
}
