//name: Sonia Atre, project name: Froggy Splat, date: 4/19/21, estimated time: 12 hours
//points breakdown: redesigned artwork, UI, and sound(60): new theme of frog trying to 
//catch flies, display timer(10), 
//create new animated sprite(10): pink splat after fly dies, new title screen(10): created 
//own background image artwork, used different fonts, and rearranged layout 
//added time to timer after successful hit (10): add time depending on score of fly
//allow player to control frog after "fired" (5), 
//created a winning screen with a princess and a heart(5?)
//all artwork is created by me

//game configuration
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let starSpeed = 4;

// reserve keyboard bindings
let keyJ, keyR, keyLEFT, keyRIGHT;