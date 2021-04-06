class Play extends Phaser.Scene {
    constructor() {
        //calling constructor of Phaser.Scene with parameter menuScene
        super("playScene");
    }

    create() {
        this.add.text(20, 20, "Rocket Patrol Play");
    }
}