var gameScene = new Phaser.Scene('game');
var score = {
    id: null,
    value: 0
};
var lives = 3;
var player, ball, ai, music, padSND, bounceSND, round, rounds, background, emitter, particles, leftWall, rightWall;
var gamemode = false;

var config = {
    type: Phaser.CANVAS,
    width: 2000,
    height: 1125,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: true
        }
    },
}

var game = new Phaser.Game(config);

gameScene.init = function () {

}

gameScene.preload = function () {
    this.load.image('backdrop', './Assets/PNG/Retina/background_brown.png');
    this.load.image('player', './Assets/PNG/Retina/block_narrow.png');
    this.load.image('ai', './Assets/PNG/Retina/block_narrow2.png');
    this.load.image('ball', './Assets/PNG/Retina/ball_red_small.png');
    this.load.image('star', './Assets/PNG/Retina/star.png');
    this.load.image('wall', './Assets/PNG/Retina/wall.png');

    this.load.audio('newer', './newer-wave-by-kevin-macleod-from-filmmusic-io.mp3');
    this.load.audio('bounce', './bounce.wav');
    this.load.audio('pad', './pad.wav');
}

gameScene.create = function () {

    background = this.add.tileSprite(0, 0, 2000, 1125, 'backdrop');
    background.setPosition(1000, 1125 / 2)

    music = this.sound.add('newer');
    padSND = this.sound.add('pad');
    bounceSND = this.sound.add('bounce');

    this.cursorKeys = this.input.keyboard.createCursorKeys();

    player = this.physics.add.sprite(50, 1125 / 2, 'player');
    player.setOrigin(0.5);
    //this.physics.add.existing(player);
    player.body.immovable = true;
    player.score = this.add.text(1000 - (32 * 2), 50, '0', {
        fontFamily: 'monospace',
        fontSize: '32px',
        fill: '#0FF'
    });
    player.value = 0;

    particles = this.add.particles('star');
    emitter = particles.createEmitter();
    emitter.setSpeed(50);
    emitter.setBlendMode(Phaser.BlendModes.ADD);
    emitter.minParticleScale = 0.15;
    emitter.maxParticleScale = 0.35;

    ball = this.physics.add.sprite(0, 0, 'ball');
    ball.x = 1000;
    ball.y = 550;
    ball.setOrigin(0.5);
    ball.setVelocity( randomDirection(350), randomDirection(350) );
    ball.setBounce(1.01, 1.01);
    ball.setCollideWorldBounds(true);

    ai = this.physics.add.sprite(1950, 1125 / 2, 'ai');
    ai.setOrigin(0.5);
    //this.physics.add.existing(ai);
    ai.body.immovable = true;
    ai.score = this.add.text(1000 + (32 * 2), 50, '0', {
        fontFamily: 'monospace',
        fontSize: '32px',
        fill: '#F00'
    });
    ai.value = 0;

    rightWall = this.physics.add.sprite(1990, 1125/2, 'wall');
    leftWall = this.physics.add.sprite(10, 1125/2, 'wall');
    
    rightWall.body.immovable = true;
    leftWall.body.immovable = true;

    round = this.add.text(900, 1000, 'Round 0', {
        fontFamily: 'monospace',
        fontSize: '32px',
        fill: '#FFF'
    })

    this.add.text(1000, 50, '|', {
        fontFamily: 'monospace',
        fontSize: '32px',
        fill: '#FFF'
    })

}

gameScene.update = function () {

    if (gamemode == true) {

        if (this.cursorKeys.up.isDown) {
            player.y -= 7;
        }

        if (this.cursorKeys.down.isDown) {
            player.y += 7;
        }

        if (ball.body.velocity.x > 0 && Phaser.Math.Distance.BetweenPoints(ball, ai) < 1500) {
            if (ai.y > ball.y) {
                ai.y -= 7
            }
            if (ai.y < ball.y) {
                ai.y += 7
            }
        }

        this.physics.world.collide(ball, [player, ai, leftWall, rightWall]);


        if (ball.body.blocked.up || ball.body.blocked.down || ball.body.blocked.left || ball.body.blocked.right) {
            bounceSND.play()
        };

        if ( Phaser.Geom.Intersects.RectangleToRectangle( ball.getBounds(), rightWall.getBounds() ) ) {
            player.value++;
            player.score.setText(player.value);
            reset();
        }
        
        if ( Phaser.Geom.Intersects.RectangleToRectangle( ball.getBounds(), leftWall.getBounds() ) ) {
            ai.value++;
            ai.score.setText(ai.value);
            reset();
        }

    }

    emitter.setPosition(ball.x, ball.y);

}

function start() {
    gamemode = true;
    document.getElementById("level").style.display = 'none';
    let tmp = document.getElementById("ai").value;
    rounds = document.getElementById("rounds").value;
    ai.level = 2000 * (1 - tmp);
    music.play();
    round.setText('rounds left ' + rounds);
    ball.x = 1000;
    ball.y = 1125 / 2;
    ball.setVelocity( Math.random()*700-350, Math.random()*700-350 );
}

function reset() {
    ball.x = 1000;
    ball.y = 1125 / 2;
    ball.setVelocity( randomDirection(350), randomDirection(350) );
    rounds--;
    round.setText('rounds left ' + rounds)
    if (rounds <= 0) {
        if (ai.value > player.value) {
            alert('Computer has won!')
        };
        if (ai.value < player.value) {
            alert('Player has won!')
        };
        if (ai.value == player.value) {
            alert('Match ends in draw!')
        };
        document.getElementById("level").style.display = 'block';
        gamemode = false;
        music.stop();
        ai.value = 0;
        player.value = 0;
    }
}

function randomDirection(n) {
    if( Math.round(Math.random()) == 0 ) { return n; } else { let tmp2=0-n; return tmp2; };
}
