var gameScene = new Phaser.Scene('game');
var score = { id: null, value: 0 };
var lives = 3;
var player, ball, ai, music, padSND, bounceSND, round, rounds, background, emitter, particles;
var gamemode = false;

var config = {
    type: Phaser.CANVAS,
    width: 2000,
    height: 1125,
    scene: gameScene,
}

var game = new Phaser.Game(config);

gameScene.init = function() {
    
}

gameScene.preload = function() {
    this.load.image('backdrop', './Assets/PNG/Retina/background_brown.png');
    this.load.image('player', './Assets/PNG/Retina/block_narrow.png');
    this.load.image('ai', './Assets/PNG/Retina/block_narrow2.png');
    this.load.image('ball', './Assets/PNG/Retina/ball_red_small.png');
    this.load.image('star', './Assets/PNG/Retina/star.png');
    
    this.load.audio('newer', './newer-wave-by-kevin-macleod-from-filmmusic-io.mp3');
    this.load.audio('bounce', './bounce.wav');
    this.load.audio('pad', './pad.wav');
}

gameScene.create = function() {

    background = this.add.tileSprite( 0, 0, 2000, 1125, 'backdrop');
    background.setPosition( 1000, 1125 / 2)
    
    music = this.sound.add('newer');
    padSND = this.sound.add('pad');
    bounceSND = this.sound.add('bounce');

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    
    player = this.add.sprite( 0, 0, 'player' );
    player.setOrigin( 0.5 );
    player.x = 100;
    player.y = 1125/2;
    player.score = this.add.text( 1000 - ( 32 * 2 ), 50, '0', { fontFamily: 'monospace', fontSize: '32px', fill: '#0FF' } );
    player.value = 0;

    particles = this.add.particles('star');
    emitter = particles.createEmitter();
    emitter.setSpeed(50);
    emitter.setBlendMode(Phaser.BlendModes.ADD);
    emitter.minParticleScale = 0.15;
    emitter.maxParticleScale = 0.35;
    
    ball = this.add.sprite( 0, 0, 'ball' );
    ball.setOrigin( 0.5 );
    ball.x = 1000;
    ball.y = 1125/2;
    ball.sx = 4 + ( Math.random() * 2 );
    ball.sy = ( (4 + ( Math.random() * 2 ) * 0.5265 )  );
    ball.accel = 0.75;
    if ( Math.round( Math.random() ) == 0 ) { ball.flagX = true; } else { ball.flagX = false; }
    if ( Math.round( Math.random() ) == 0 ) { ball.flagY = true; } else { ball.flagY = false; }

    ai = this.add.sprite( 0, 0, 'ai' );
    ai.tint = 0xff0000;
    ai.setOrigin( 0.5 );
    ai.x = 1900;
    ai.y = 1125/2;
    ai.score = this.add.text( 1000 + ( 32 * 2 ), 50, '0', { fontFamily: 'monospace', fontSize: '32px', fill: '#F00' } );
    ai.value = 0;
    
    round = this.add.text ( 900, 1000, 'Round 0', { fontFamily: 'monospace', fontSize: '32px', fill: '#FFF' } )

    this.add.text ( 1000, 50, '|', { fontFamily: 'monospace', fontSize: '32px', fill: '#FFF' } )

}

gameScene.update = function() {

    if ( gamemode == true ) {

        if ( this.cursorKeys.up.isDown ) {
            player.y-=5;
        }

        if ( this.cursorKeys.down.isDown ) {
            player.y+=5;
        }

        if ( player.y > 1125 ) { player.y = 1125 }
        if ( player.y < 0 ) { player.y = 0 }
    
        if ( ball.flagX == true ) { ball.x+=ball.sx };
        if ( ball.flagX == false ) { ball.x-=ball.sx };

        if ( ball.flagY == true ) { ball.y+=ball.sy };
        if ( ball.flagY == false ) { ball.y-=ball.sy };

        if ( ball.flagX == true && ball.x > 2000 ) { ball.flagX = false; ball.sx += ball.accel; player.value++; player.score.setText( player.value ); bounceSND.play(); reset();  };
        if ( ball.flagX == false && ball.x < 0 ) { ball.flagX = true; ball.sx += ball.accel; ai.value++; ai.score.setText( ai.value ); bounceSND.play(); reset() };

        if ( ball.flagY == true && ball.y > 1125 ) { ball.flagY = false; ball.sy += ball.accel * 0.5265; bounceSND.play(); };
        if ( ball.flagY == false && ball.y < 0 ) { ball.flagY = true; ball.sy += ball.accel * 0.5265; bounceSND.play(); };

        if ( ball.flagX == false && ball.y < player.y + 125 && ball.y > player.y - 125 && ball.x < player.x + 25 && ball.x > player.x - 25 ) { ball.flagX = true; ball.sx += ball.accel; padSND.play(); }
        if ( ball.flagX == true && ball.y < ai.y + 125 && ball.y > ai.y - 125 && ball.x > ai.x - 25 && ball.x < ai.x + 25 ) { ball.flagX = false; ball.sx += ball.accel; padSND.play(); }

        if ( ball.flagX == true && ball.x > ai.level ) { 
            if ( ball.y > ai.y ) { ai.y+=5 }
            if ( ball.y < ai.y ) { ai.y-=5 }
        }
        
        emitter.setPosition( ball.x, ball.y );

    }

}

function start() {
    gamemode = true;
    document.getElementById("level").style.display = 'none';
    let tmp = document.getElementById("ai").value;
    rounds = document.getElementById("rounds").value;
    ai.level = 2000 * ( 1 - tmp );
    music.play();
    round.setText('rounds left ' + rounds )
}

function reset() {
    ball.x = 1000;
    ball.y = 1125/2;
    ball.sx = 4 + ( Math.random() * 2 );
    ball.sy = ( (4 + ( Math.random() * 2 ) * 0.5265 )  );
    rounds--;
    round.setText('rounds left ' + rounds )
    if ( rounds <= 0 ) {
        if ( ai.value > player.value ) { alert('Computer has won!') };
        if ( ai.value < player.value ) { alert('Player has won!')};
        if ( ai.value == player.value ) { alert('Match ends in draw!')};
         document.getElementById("level").style.display = 'block';
        gamemode = false;
        music.stop();
        ai.value = 0;
        player.value = 0;
    }
}