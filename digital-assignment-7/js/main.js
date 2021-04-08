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
const createAligned = (scene, count, texture, scrollFactor) =>{
    let x = 0;
    for (let i = 0; i < count; i++) {
        const m = scene.add.image(x,scene.scale.height * 0.8, texture)
        .setScrollFactor(scrollFactor);
        x += m.width;
    }
}

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
        this.load.image('tube2', 'assets/tube4.png');
        this.load.image('tube1', 'assets/tube3.png');
        this.load.image('off', 'assets/Off.png');
         //load background and ground layer
        //this.load.image('bg', 'assets/background/sky.jpg');
        this.load.image('player', 'assets/characters/bird.png');

        this.load.image('chest', 'assets/chest.png');

        //load audio
        this.load.audio('bgm','assets/audio/bgm.mp3');
        this.load.audio('lose','assets/audio/sad-song.mp3');
        this.load.audio('win','assets/audio/classic-song.mp3');
        // this.load.audio('bounce','assets/audio/bounce.mp3');

    }

    create ()
    {          


        const width = this.scale.width;
        const height = this.scale.height;
        var gameOver = false;
        var score = 0;
        var scoreText;
        var count =10;
        var groundX = 400;
        var pipeX = 600
        // add bgm 
        this.bgm = this.sound.add('bgm');
        this.lose = this.sound.add('lose');
        this.win = this.sound.add('win');

        // play bgm
        this.bgm.play();
    
        this.physics.world.bounds.x = 100;
        

        createAligned(this, count, 'bg', 0.5);
        createAligned(this, count, 'cloud', 0.5);
        

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(0, 568, 'ground').setScale(2).refreshBody();

        for (var i = 0; i <10; i++) {
            this.platforms.create(groundX, 568, 'ground').setScale(2).refreshBody();
            groundX+= 400; 
        }

        
        this.tube2 = this.physics.add.staticGroup();
        this.tube1 = this.physics.add.staticGroup();    

        this.finishLine = this.physics.add.staticGroup();   

        this.tube1.create(pipeX, 0, 'tube1').refreshBody();
        this.tube2.create(pipeX, 600, 'tube2').refreshBody();

        for (let index = 0; index < 10; index++) {
            this.randomNumber = Phaser.Math.Between(1,5);
            pipeX+=300;
            switch (this.randomNumber) {
                
                case 1:
                    this.tube1.create(pipeX, -200, 'tube1').refreshBody();
                    this.tube2.create(pipeX, 400, 'tube2').refreshBody();
                    break;
                case 2:
                    this.tube1.create(pipeX, -100, 'tube1').refreshBody();
                    this.tube2.create(pipeX, 500, 'tube2').refreshBody();
                    break;
                case 3:
                    this.tube1.create(pipeX, 0, 'tube1').refreshBody();
                    this.tube2.create(pipeX, 600, 'tube2').refreshBody();
                    break;
                case 4:
                    this.tube1.create(pipeX, 100, 'tube1').refreshBody();
                    this.tube2.create(pipeX, 700, 'tube2').refreshBody();
                    break;
                case 5:
                    this.tube1.create(pipeX, 150, 'tube1').refreshBody();
                    this.tube2.create(pipeX, 750, 'tube2').refreshBody();
                    break;

                default:
                    break;
            }
        }

        this.finishLine.create(pipeX+75, 250, 'tube1').refreshBody().setVisible(false);

        this.physics.world.bounds.width = groundX;
        
        this.text = this.add.text(200, 150, 'Press UP to fly', { font: '32px Courier', fill: '#000000' });


        // The player and its settings
        this.player = this.physics.add.sprite(200, 400, 'player');
        this.player.setSize(400,400);
        this.player.setScale(0.08);
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setCollideWorldBounds(true);

        //create camera 
        //this.cameras.main.setBounds(0, 0, 2160, 1080);
        //this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setBounds(100, 0, width *11, height);

        //this.cameras.main.setSize(800,600);
         this.cameras.zoom = 3;

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.reset = this.input.keyboard.addKey('R');

        //collider
        this.physics.add.collider(this.player, this.platforms,this.getHit,null,this);
        this.physics.add.collider(this.player, this.tube2,this.getHit,null,this);
        this.physics.add.collider(this.player, this.tube1,this.getHit,null,this);
        this.physics.add.collider(this.player, this.finishLine,this.getChest,null,this);





    }

    update ()
    {
        var flipFlop;
        const cam = this.cameras.main;
        var speed = 1.75;
        cam.scrollX +=speed;
        this.player.x+= speed;

        if (this.gameOver)
        {
            this.player.play('turn');
            this.physics.pause();
            cam.scrollX =0;
            this.player.x= 200;
            this.player.y= 400
        }   
        
        if(this.reset.isDown){
            this.bgm.stop();
            this.win.stop();
            this.lose.stop();
            this.gameOver = false;
            this.scene.restart();
            this.scene.resume();

        }

        if (this.cursors.up.isDown)
        {
            if (!flipFlop) {
            this.player.setVelocityY(-180);
            flipFlop = true;
            }
        }
        else if (this.cursors.up.isUp){
            flipFlop = false;
        }
        else {
          this.player.setAccelerationY(400);
         }

        

    }

    getHit(){
        this.bgm.stop();
        this.lose.play();
        let style = { font: "30px Tahoma", fill: "#000000", align: "center" };
        let text = this.add.text( this.player.x + 200, this.player.y-250, "You Lose\n Press R to Play Again", style );
        this.gameOver = true;
    }
    getChest(){
        this.bgm.stop();
        this.win.play();
        let style = { font: "30px Tahoma", fill: "#000000", align: "center" };
        let text = this.add.text( this.player.x + 200, this.player.y-100, "Congratulation!\nYou Won", style );
        this.gameOver = true;
    }

}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,      
            gravity: {y :600}   
        }
    },
    scene: MyScene
});