class Play extends Phaser.Scene {
    constructor() {
        //calling constructor of Phaser.Scene with parameter menuScene
        super("playScene");
    }

    // init(), preload(), create(), update()
    preload() {
        //load image/tile sprites
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('spaceship', 'assets/spaceship.png');
        this.load.image('starfield', 'assets/starfield.png');
    }

    create() {
        //place starfield
        //create starfield as property of object so have access to in other functions
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 
            'starfield').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderUISize, game.config.width,
            borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin
        (0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, 
            borderUISize, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(0,0, borderUISize, game.config.height, 0xFFFFFF).setOrigin
        (0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.
            config.height, 0xFFFFFF).setOrigin(0,0);

        // add rocket(player 1)
        this.p1Rocket  = new Rocket(this, game.config.width / 2, game.config.height - 
            borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
    }

    update() {
        this.starfield.tilePositionX -= starSpeed;
    }
}