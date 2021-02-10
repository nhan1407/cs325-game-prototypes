import "./phaser.js";

// You can copy-and-paste the code from any of the examples at https://examples.phaser.io here.
// You will need to change the `parent` parameter passed to `new Phaser.Game()` from
// `phaser-example` to `game`, which is the id of the HTML element where we
// want the game to go.
// The assets (and code) can be found at: https://github.com/photonstorm/phaser3-examples
// You will need to change the paths you pass to `this.load.image()` or any other
// loading functions to reflect where you are putting the assets.
// All loading functions will typically all be found inside `preload()`.

// The simplest class example: https://phaser.io/examples/v3/view/scenes/scene-from-es6-class

class MyScene extends Phaser.Scene {
    
    
    preload() {
        // Load Background + Character
        this.load.image( 'bg', 'assets/bg.png' );
        this.load.image('ninja-1', 'assets/characters/idle-1.PNG');
        this.load.image('ninja-2', 'assets/characters/idle-2.PNG');

        // Load sound effects
        this.load.audio('bgm'.['assets/sfx/bgm.mp3']);
        this.load.audio('shuriken'.['assets/sfx/shuriken.mp3']);
        this.load.audio('signal'.['assets/sfx/slash.mp3']);
       

        
        }
    
    create() {
        //creating bacground and character
        this.add.image(500,150,'bg');
        this.player = this.add.sprite(120, 480, 'ninja-1');
        this.player = this.add.sprite(680, 480, 'ninja-2');

        //initialize buttons
        this.enter = this.input.keyboard.addKey('ENTER');
        this.reset = this.input.keyboard.addKey('R');

        //adding  sound effects
        this.bgm = this.sound.add('bgm');
        this.shuriken = this.sound.add('shuriken');
        this.signal = this.sound.add('signal');

        this.bgm.play();
    }
    
    update() {

    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
