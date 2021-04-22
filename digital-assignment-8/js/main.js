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
    constructor()
    {
        super();
    }

    preload ()
    {  
        this.load.image('bg', 'assets/background/background.png');
        this.load.image('ground', 'assets/background/pirate-map.png');
        this.load.image('cloud', 'assets/background/cloud.png');
        this.load.image('swing', 'assets/characters/block-rope.png');
        this.load.image('player', 'assets/characters/block.png');
        //load audio
        this.load.audio('bgm','assets/audio/bgm.mp3');
        this.load.audio('lose','assets/audio/sad-song.mp3');
        this.load.audio('win','assets/audio/classic-song.mp3');
        this.load.audio('bounce','assets/audio/drop.mp3');

    }

    create ()
    {          


        const width = this.scale.width;
        const height = this.scale.height;
        var gameOver = false;
        var score = 0;
        var scoreText;
        this.lastX = 0;
        this.dropY =1800;
        this.dropX = 0
        this.blockCount=0;
        this.count = 0;
        // add bgm 
        this.bounce = this.sound.add('bounce');
        this.bgm = this.sound.add('bgm');
        this.lose = this.sound.add('lose');
        this.win = this.sound.add('win');

        // play bgm
        this.bgm.play();
    
        this.add.image(0,0,'bg')
        this.physics.world.bounds.x = 0;

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(0, 2568, 'ground').setScale(2).refreshBody();
        this.platforms.create(400, 2568, 'ground').setScale(2).refreshBody();
    
        this.text = this.add.text(0, 2000, 'Press SPACE to DROP', { font: '32px Courier', fill: '#000000' });


        // The player and its settings

        this.base = this.physics.add.staticGroup();
        this.base.create (290,2500,'player').setScale(0.5).refreshBody();
        this.base.create (100,2500,'player').setScale(0.5).refreshBody();
        this.base.create (195,2500,'player').setScale(0.5).refreshBody();

        
        this.player = this.physics.add.group();


        this.swing = this.add.sprite(200,1800,'swing').setScale(0.5).setOrigin(0.5, 0)

        this.dropX = this.tweens.addCounter({
            from: -60,
            to: 60,
            duration: 1000,
            yoyo:true,
            repeat: -1,
        });


        //create camera 

        this.cameras.main.setBounds(0, 1800  , 4000, 4000);
        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.reset = this.input.keyboard.addKey('R');
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        //collider
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.base, this.touch, null, this);



        this.newBlock = null;



    }

    update ()
    {
        this.swing.setAngle(this.dropX.getValue())
        const cam = this.cameras.main;


        if (this.gameOver)
        {
            this.newBlock.angle -=5;
            this.physics.pause();
            console.log("gameOver")

        }   
        
        if(this.reset.isDown){
            this.bgm.stop();
            this.win.stop();
            this.lose.stop();
            console.log("pressed R")
            this.gameOver = false;
            this.scene.restart();
            this.scene.resume();

        }

        if (Phaser.Input.Keyboard.JustDown(this.spacebar))
        {   if(this.dropX.getValue() <0){
                this.newBlock = this.player.create (this.dropX.getValue() *-1 + 200,this.dropY,'player').setScale(0.5).setBounce(-1).refreshBody();
            }
            else if(this.dropX.getValue() == 0){
                this.newBlock = this.player.create (245,this.dropY,'player').setScale(0.5).setBounce(-1).refreshBody();
            }
            else {
                this.newBlock = this.player.create (130 - (this.dropX.getValue()),this.dropY,'player').setScale(0.5).setBounce(-1).refreshBody();
            }

        }
        
        if (this.count == 8) {
            this.winGame()
        }
        

        

    }
    touch(){
        this.newBlock.setActive(false).setVisible(false);
        this.bounce.play()
        console.log(this.newBlock.x)
        console.log(this.lastX)
        if ((this.newBlock.x - this.lastX < -45 || this.newBlock.x - this.lastX > 45) && this.lastX != 0) {
            this.loseGame()
        }
        else{
            this.lastX = this.newBlock.x;
        }
        this.base.create (this.newBlock.x,this.newBlock.y,'player').setScale(0.5).refreshBody();
        this.newBlock.destroy();
        this.count++
    }

    loseGame(){
        this.text.destroy();
        this.bgm.stop();
        this.lose.play();
        let style = { font: "30px Tahoma", fill: "#000000", align: "center" };
        let text = this.add.text(0, 2000, " Tower Collapse\nYou Lose\n Press R to Play Again", style );
        this.gameOver = true;
    }
    winGame(){
        this.text.destroy();
        this.bgm.stop();
        this.win.play();
        let style = { font: "30px Tahoma", fill: "#000000", align: "center" };
        let text = this.add.text( 0, 2000, "Congratulation!\nYou Won", style );
        this.gameOver = true;
    }

}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 400,
    height: 800,
    backgroundColor: '#4488aa',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,      
            gravity: {y :1000}   
        }
    },
    scene: MyScene
});