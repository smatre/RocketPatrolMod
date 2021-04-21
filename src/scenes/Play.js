class Play extends Phaser.Scene {
    constructor() {
        //calling constructor of Phaser.Scene with parameter menuScene
        super("playScene");
    }

    // init(), preload(), create(), update()
    preload() {
        //load image/tile sprites
        this.load.image('frog', 'assets/frog.png');
        this.load.image('fly', 'assets/fly.png');
        this.load.image('cloudsky', 'assets/sky.png');
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
        //place cloud sky
        //create cloud sky as property of object so have access to in other functions
        this.cloudsky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 
            'cloudsky').setOrigin(0, 0);
        // purple UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width,
            borderUISize * 2, 0x00BFFC).setOrigin(0, 0);

        // add frog(player 1)
        this.p1Frog  = new Frog(this, game.config.width / 2, game.config.height - 
            borderUISize - borderPadding * 4, 'frog').setOrigin(0.5, 0);

        // add fly (x3)
        this.fly01 = new Fly(this, game.config.width + borderUISize * 6, 
            borderUISize * 6, 'fly', 0, 30).setOrigin(0, 0);
        this.fly02 = new Fly(this, game.config.width + borderUISize * 3, 
            borderUISize * 5 + borderPadding * 2, 'fly', 0, 20).setOrigin(0, 0);
        this.fly03 = new Fly(this, game.config.width, 
            borderUISize * 6 + borderPadding * 4, 'fly', 0, 10).setOrigin(0, 0);

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
        this.timer = this.time.addEvent({ delay: 1000, callback: this.updateTimer, 
            callbackScope: this, loop: true });
   
        
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            //won game
            if (this.p1Score >= 200) {
                this.add.text(game.config.width/2, game.config.height/2 - 64, 
                    'YOU WON!', scoreConfig).setOrigin(0.5);
                this.heart = this.add.image(this.p1Frog.x + this.p1Frog.width/2, 
                    game.config.height - borderUISize - borderPadding * 2, 'heart');
                this.heart.setDisplaySize(150, 150);
                this.princess = this.add.image(this.p1Frog.x + this.p1Frog.width + 5, 
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

        this.cloudsky.tilePositionX -= starSpeed;

        if (!this.gameOver) {
            this.p1Frog.update(); //update fly sprite
            this.fly01.update();   //update flies(x3)
            this.fly02.update();
            this.fly03.update();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //check collisions 
        if (this.checkCollision(this.p1Frog, this.fly03)) {
            this.p1Frog.reset();
            this.flyKill(this.fly03);
        }
        if (this.checkCollision(this.p1Frog, this.fly02)) {
            this.p1Frog.reset();
            this.flyKill(this.fly02);
        }
        if (this.checkCollision(this.p1Frog, this.fly01)) {
            this.p1Frog.reset();
            this.flyKill(this.fly01);
        }

    }

    checkCollision(frog, fly) {
        //simple AABB checking
        if (frog.x < fly.x + fly.width / 3 && 
            frog.x + frog.width / 5 > fly.x &&
            frog.y < fly.y + fly.height / 5 &&
            frog.height / 5 + frog.y > fly.y) {
                return true;
        } else {
            return false;
        } 
    }

    flyKill(fly) {
        //temporarily hide fly
        fly.alpha = 0;
        //create explosion sprite at fly's position
        let boom = this.add.sprite(fly.x, fly.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            fly.reset();
            fly.alpha = 1;
            boom.destroy();
        });
        
        //increase time
        this.timeInSec += fly.points/5;
        // score add and repaint
        this.p1Score += fly.points;
        //replaces contents with new value
        this.scoreLeft.text = this.p1Score;
        //add explosion sound
        this.sound.play('fly_dead');
        this.successHit = true;

    }

    updateTimer() {
        
        if (this.timeInSec > 0) {
            console.log(this.timeInSec);
            
            this.timeInSec--;
        }
        
        var minutes = Math.floor(this.timeInSec / 60);
        console.log(minutes);
        var seconds = this.timeInSec - (minutes * 60);
        var stringTimer = this.padZeros(minutes) + ":" + this.padZeros(seconds);
        
        this.timerText.text = stringTimer;
        
    }

    padZeros(num) {
        if (num < 10) {
            num = "0" + num;
        }
        return num;
    }
}