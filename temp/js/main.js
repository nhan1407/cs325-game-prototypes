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
var panda;
var healthGroup;
var text;
var cursors;
var currentHealth = 100;
var maxHealth = 100;
var timedEvent;
var oasisTimedEvent;
var spawnOasisTime;
var oasis;
var gameOver = false;
var bgm;
var pick;
var lose;
var win;


class MyScene extends Phaser.Scene {

    preload ()
    {
        // preload image
        //this.load.image('cat', 'assets/characters/player_handgun.png');
        this.load.image('health', 'assets/pt.png');
        this.load.image('bg', 'assets/background/sand.jpg');
        this.load.image('oasis', 'assets/oasis.png');

        // preload sound
        // this.load.audio('bgm','assets/audio/bgm2.mp3');
        // this.load.audio('pick','assets/audio/pick.mp3');
        // this.load.audio('win','assets/audio/classic-song.mp3');
        // this.load.audio('lose','assets/audio/sad-song.mp3');


        this.load.spritesheet("panda","assets/characters/panda/panda3.png",{
            frameWidth: 32,
            frameHeight:32
        });
    }
    create ()
    {

        //add sounds
        // bgm = this.sound.add('bgm');
        // pick = this.sound.add('pick');
        // win = this.sound.add ('win');
        // lose = this.sound.add('lose');
        // bgm.play();

        this.add.image(0,0,'bg');
        panda = this.physics.add.sprite(400, 300, "panda", 0);

        //animation for panda
        this.anims.create({
            key:"panda-idle",
            frames: this.anims.generateFrameNumbers("panda", {start:0, end:0}),
            frameRate:12,
            repeat:-1
        });
        this.anims.create({
            key:"panda-up",
            frames: this.anims.generateFrameNumbers("panda", {start:6, end:8}),
            frameRate:12,
            repeat:-1
        });
        this.anims.create({
            key:"panda-down",
            frames: this.anims.generateFrameNumbers("panda", {start:3, end:5}),
            frameRate:12,
            repeat:-1

        });
        this.anims.create({
            key:"panda-left",
            frames: this.anims.generateFrameNumbers("panda", {start:12, end:14}),
            frameRate:12,
            repeat:-1
        });

        this.anims.create({
            key:"panda-right",
            frames: this.anims.generateFrameNumbers("panda", {start:9, end:11}),
            frameRate:12,
            repeat:-1

        });
        //make sure player dont go out of bound
        panda.setCollideWorldBounds(true);

        //
        cursors = this.input.keyboard.createCursorKeys();
        
        //  
        panda.setInteractive();
        //panda.play("panda-down");
    }

    update ()
    {
        

        if (cursors.left.isDown)
        {
            panda.anims.play("panda-left",true);
            panda.setVelocityX(-200);
        }
        else if (cursors.right.isDown)
        {
            panda.anims.play("panda-right",true);
            panda.setVelocityX(200);
        }

        else if (cursors.up.isDown)
        {
            panda.anims.play("panda-up",true);
            panda.setVelocityY(-200);
        }
        else if (cursors.down.isDown)
        {
            panda.anims.play("panda-down",true);
            panda.setVelocityY(200);
        }
        else 
        {
            panda.setVelocity(0);
            panda.play("panda-idle",true);
        }

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
