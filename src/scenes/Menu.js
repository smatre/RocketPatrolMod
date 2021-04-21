class Menu extends Phaser.Scene {
    constructor() {
        //calling constructor of Phaser.Scene with parameter menuScene
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('select_mode', 'assets/blip_select12.wav');
        this.load.audio('fly_dead', 'assets/squish.wav');
        this.load.audio('frog_jump', 'assets/bounce.wav');
        this.load.image('cover', 'assets/cover.png');
    }

    create() {
        this.cover = this.add.image(game.config.width / 2, game.config.height / 2, 'cover');
        this.cover.setDisplaySize(game.config.width, game.config.height);
        //menu text configuration
        let menuConfig = {
            fontFamily: 'Serif',
            fontSize: '35px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        this.add.text(game.config.width/2, game.config.height/4.5 - borderUISize -
            borderPadding, 'Froggy Splat!', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#90E3FF';
        menuConfig.fontSize = '30px';
        this.add.text(game.config.width/2, game.config.height/1.2, 
            'Use <--> arrows to move & (J) to jump', menuConfig).setOrigin(0.5);
        
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/1.2 + borderUISize + borderPadding, 
            'Press <- for Beginner or -> for BEAST Mode', menuConfig).setOrigin(0.5); 

        //define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            //easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('select_mode');
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            //hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('select_mode');
            this.scene.start('playScene');
        }
    }
}