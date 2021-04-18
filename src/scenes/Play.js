class Play extends Phaser.Scene {
    constructor() {
        //calling constructor of Phaser.Scene with parameter menuScene
        super("playScene");
    }

    // init(), preload(), create(), update()
    preload() {
        //load image/tile sprites
        this.load.image('rocket', 'assets/frog.png');
        this.load.image('spaceship', 'assets/fly.png');
        this.load.image('starfield', 'assets/sky.png');
        this.load.image('princess', 'assets/princess.png');
        this.load.image('heart', 'assets/heart.png');
        //load spritesheet
        this.load.spritesheet('explosion', 'assets/splat.png', {
            frameWidth: 30,
            frameHeight: 32,
            startFrame: 30
        });
    }

    create() {
        //place starfield
        //create starfield as property of object so have access to in other functions
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 
            'starfield').setOrigin(0, 0);
        // blue UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width,
            borderUISize * 2, 0x00BFFC).setOrigin(0, 0);

        //white borders
        // this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin
        // (0,0);
        // this.add.rectangle(0, game.config.height - borderUISize, game.config.width, 
        //     borderUISize, 0xFFFFFF).setOrigin(0,0);
        // this.add.rectangle(0,0, borderUISize, game.config.height, 0xFFFFFF).setOrigin
        // (0, 0);
        // this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.
        //     config.height, 0xFFFFFF).setOrigin(0,0);

        // add rocket(player 1)
        this.p1Rocket  = new Rocket(this, game.config.width / 2, game.config.height - 
            borderUISize - borderPadding * 4, 'rocket').setOrigin(0.5, 0);

        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, 
            borderUISize * 6, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, 
            borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 
            borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);

        //define keys
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //animation config
        this.anims.create({
           key: 'explode',
           frames: this.anims.generateFrameNumbers('explosion', {
               start: 0,
               end: 5,
               first: 0
           }),
           frameRate: 30
        });
        
        //initialize score
        this.p1Score = 0;
        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, 
            borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
         //add countdown timer
        this.timeInSec = game.settings.gameTimer / 1000;
        this.minScore = this.add.text(this.game.config.width/2
            -borderUISize - borderPadding, 
            borderUISize + borderPadding * 2, "Get a minimum \nscore of 200 to win", 
            {font: '20px Arial', fill: '#000000', align: 'center'})
        this.timerText = this.add.text(game.config.width - 
            borderPadding - borderUISize * 2, borderUISize + borderPadding * 2,
            "0:00", {font: '20px Arial', fill: '#FF0000', align: 'center'});
        //this.timerText.anchor.set(0.5, 0.5);
        this.timer = this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });
   
        
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            //won game
            if (this.p1Score >= 200) {
                this.add.text(game.config.width/2, game.config.height/2 - 64, 
                    'YOU WON!', scoreConfig).setOrigin(0.5);
                this.heart = this.add.image(this.p1Rocket.x + this.p1Rocket.width/2, 
                    game.config.height - borderUISize - borderPadding * 2, 'heart');
                this.heart.setDisplaySize(150, 150);
                this.princess = this.add.image(this.p1Rocket.x + this.p1Rocket.width + 5, 
                    game.config.height - borderUISize - borderPadding * 3, 'princess');
            }
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 
                'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

    }

    

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        this.starfield.tilePositionX -= starSpeed;

        if (!this.gameOver) {
            this.p1Rocket.update(); //update rocket sprite
            this.ship01.update();   //update spaceships(x3)
            this.ship02.update();
            this.ship03.update();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //check collisions 
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

    }

    checkCollision(rocket, ship) {
        //simple AABB checking
        if (rocket.x < ship.x + ship.width / 3 && 
            rocket.x + rocket.width / 5 > ship.x &&
            rocket.y < ship.y + ship.height / 5 &&
            rocket.height / 5 + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        } 
    }

    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0;
        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        // score add and repaint
        this.p1Score += ship.points;
        //replaces contents with new value
        this.scoreLeft.text = this.p1Score;
        //add explosion sound
        this.sound.play('sfx_explosion');

    }
    updateTimer() {
        if (this.timeInSec > 0) {
            this.timeInSec--;
        }
        var minutes = Math.floor(this.timeInSec / 60);
        console.log(minutes);
        var seconds = this.timeInSec - (minutes * 60);
        var stringTimer = this.padZeros(minutes) + ":" + this.padZeros(seconds);
        
        this.timerText.text = stringTimer;
        
        
        // if (this.timeInSec == 0) {
        //     this.timerText.destroy();
        // }
    }

    padZeros(num) {
        if (num < 10) {
            num = "0" + num;
        }
        return num;
    }
}