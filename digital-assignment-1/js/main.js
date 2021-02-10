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

        // Load sound effects and bgm
        this.load.audio('bgm','assets/sfx/bgm.mp3');
        this.load.audio('shuriken','assets/sfx/shuriken.mp3');
        this.load.audio('signal','assets/sfx/slash.mp3');
       

        
        }
    
    create() {
        //creating bacground and character
        this.add.image(500,150,'bg');
        this.player = this.add.sprite(120, 480, 'ninja-1');
        this.player = this.add.sprite(680, 480, 'ninja-2');

        //initialize buttons
        this.attack = this.input.keyboard.addKey('A');
        this.reset = this.input.keyboard.addKey('R');

        //adding  sound effects
        this.bgm = this.sound.add('bgm');
        this.shuriken = this.sound.add('shuriken');
        this.signalAudio = this.sound.add('signal');
        this.bgm.play();
        
        



        //generate a random number to used as a signal timer
        this.randomNumber = Phaser.Math.Between(1,10);
        console.log(" random number: " + this.randomNumber);
        
        // Seting enemy's reaction time.
        this.enemyReactionTime = Phaser.Math.Between(300,500);
        
        //start signal timer
        signalTimer = this.time.delayedCall(randomNumber,gameStart,[], this);
        console.log("signal timer run");


    }
    
    update() {
        if (signalTimer.getElapsedSeconds() >= this.randomNumber) {
            this.signal.play();
            enemyTimer = Scene.time.delayedCall(delay, callback, args, scope);
            console.log("signal run");
        }   this.signal = true;
        if (this.signal== true){
            console.log("Dueling time");
        }
    }
    // get all value ready for the game.
    gameStart(){
        this.isAlive = true;
        this.haveShuriket = true;
        this.signal = false;
        console.log("Finishing setup");

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
