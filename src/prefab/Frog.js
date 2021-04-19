class Frog extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //add object to the existing scene
        scene.add.existing(this);
        this.isJumping = false;  //track frog jumping status
        this.moveSpeed = 2; //pixels per frame
        this.frogJump = scene.sound.add('frog_jump'); //add frog jump
    }

    update() {
        //left/right movement
        //holding left, as long as x position is greater than width + frog width
        if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize -
            this.width) {
            this.x += this.moveSpeed;
        }


        //jump button
        if (Phaser.Input.Keyboard.JustDown(keyJ) && !this.isJumping) {
            this.isJumping = true;
            this.frogJump.play()   //play jump
        }
        //if jump, move frog up
        if (this.isJumping && this.y >= borderUISize * 2 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        //reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    //reset frog to ground
    reset() {
        this.isJumping = false;
        this.y = game.config.height - borderUISize - borderPadding * 4;
    }
}