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
        this.load.image( 'ranger', 'assets/arrow.png' );
        

        // Load sound effects and bgm
        //this.load.audio('bgm','assets/audio/bgm.mp3');
        
        console.log('Preload finished');

        
        }
    
    create() {
        //creating bacground and character
        //this.add.image(500,150,'bg');
        // this.player = this.add.sprite(120, 480, 'ninja-1');
        // this.comp = this.add.sprite(680, 480, 'ninja-2');
        this.ranger = this.add.sprite(400,300,'ranger');
        this.ranger.setScale(.05);

        //initialize buttons
        this.attack = this.input.keyboard.addKey('SPACE');
        this.reset = this.input.keyboard.addKey('R');
        
        var tween = this.tweens.addCounter({
        from: 0,
        to: 360,
        duration: 5000,
        repeat: -1,
        onUpdate: function (tween)
        {
              tween.getValue = range between 0 and 360

            bar.setAngle(tween.getValue());
        }
        });
        

    }
    update() {        
        // Play again when player press R.
        if(this.reset.isDown){
            this.scene.restart();
        }
    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#5AFF66',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
