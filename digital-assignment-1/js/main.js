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
var enemyReactionTimer;

class MyScene extends Phaser.Scene {

    preload() {
        // Load Background + Character
        this.load.image( 'bg', 'assets/bg.png' );
        this.load.image('ninja-1', 'assets/characters/idle-1.PNG');
        this.load.image('ninja-2', 'assets/characters/idle-2.PNG');
        this.load.image('dead-1', 'assets/characters/dead-1.PNG');
        this.load.image('dead-2', 'assets/characters/dead-2.PNG');

        // Load sound effects and bgm
        this.load.audio('bgm','assets/audio/bgm.mp3');
        this.load.audio('shuriken','assets/audio/shuriken.mp3');
        this.load.audio('signal','assets/audio/slash.mp3');
        this.load.audio('nope','assets/audio/nope.mp3');
        console.log('Preload finished');

        
        }
    
    create() {


        //creating bacground and character
        this.add.image(500,150,'bg');
        this.player = this.add.sprite(120, 480, 'ninja-1');
        this.comp = this.add.sprite(680, 480, 'ninja-2');


        //initialize buttons
        this.attack = this.input.keyboard.addKey('SPACE');
        this.reset = this.input.keyboard.addKey('R');

        //adding sound effects
        this.bgm = this.sound.add('bgm');
        this.shuriken = this.sound.add('shuriken');
        this.signalAudio = this.sound.add('signal');
        this.nope = this.sound.add('nope');
        this.bgm.play();
        
        

        //generate a random number to used as a signal timer
        this.randomNumber = Phaser.Math.Between(3,10);
        console.log(" random number: " + this.randomNumber);
        
        // Seting enemy's reaction time.
        this.enemyReactionTime = Phaser.Math.Between(7,12);

        // setting condition for gameplay
        this.player_isAlive = true;
        this.comp_isAlive = true;
        this.haveShuriken = true;
        this.signal = false;
        console.log("Finishing setup");

        // initialize timer for for the signal
        var signalTimer = this.time.delayedCall(this.randomNumber *1000,this.playSignal,[], this);

    }
    
    update() {

        // Print the tutorial
        if(this.comp_isAlive ==  true && this.player_isAlive ==  true){
            let style = { font: "30px Tahoma", fill: "#ffffff", align: "top" };
            let text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "Press SPACE to Attack", style );
            text.setOrigin( 0.5, 5 );
        }

        // If player press SPACE before signal, they will lose the game
        if( this.attack.isDown && this.signal == false){
            this.nope.play();
            this.haveShuriken = false;
            console.log ("Wrong timming, You Lose");
        }
        // if play Press SPACE after the signal and before computer reaction. Player WIN.
        if(this.attack.isDown && this.signal == true && this.player_isAlive == true){
            //Get elapsed time to check player'sreaction time
            var elapsed = enemyReactionTimer.getElapsed();
            if (elapsed < 5000 && this.haveShuriken == true) {
                this.shuriken.play();
                this.cameras.main.flash();
                this.haveShuriken = false;
                this.comp_isAlive = false;
                enemyReactionTimer.remove();
                this.comp.setTexture('dead-2');
                console.log("Player Win" + elapsed);
            }
        }
        // if player lose, player ninja falls
        if (this.player_isAlive == false && this.player.angle >-90) {
            this.player.angle -=5;
            let style = { font: "30px Tahoma", fill: "#ffffff", align: "center" };
            let text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU LOSE\nPress R to play again", style );
            text.setOrigin( 0.5, 0.0 );
        }
        //otherwise, computer ninja falls
        if(this.comp_isAlive ==  false && this.comp.angle <90){
            this.comp.angle +=5;
            let style = { font: "30px Tahoma", fill: "#ffffff", align: "center" };
            let text = this.add.text( this.cameras.main.centerX, this.cameras.main.centerY, "YOU WIN\nPress R to play again", style );
            text.setOrigin( 0.5, 0.0 );
        }
        // Play again when player press R.
        if(this.reset.isDown){
            this.scene.restart();
        }
         

    }
    // play signal sound effect and start the reaction timer.
    playSignal(){
        this.signalAudio.play();
        this.signal = true;
        enemyReactionTimer = this.time.delayedCall(this.enemyReactionTime*100,this.computerWin,[], this);
        console.log("Dueling time " +this.enemyReactionTime);
    }
    // If the computer's timer run out of time, which means player lose. This function will execute. 
    computerWin(){
        this.player_isAlive = false; 
        this.shuriken.play();
        this.haveShuriken = false;
        this.cameras.main.flash();
        this.player.setTexture('dead-1');
        enemyReactionTimer.remove();
        console.log("Computer Win");
        
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
