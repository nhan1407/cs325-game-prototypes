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
    {   //load background and ground layer
        this.load.image('bg', 'assets/background/sky.jpg');
        this.load.image('player', 'assets/characters/bird.png');


        //load audio
        // this.load.audio('bgm','assets/audio/bgm.mp3');
        // this.load.audio('lose','assets/audio/sad-song.mp3');
        // this.load.audio('win','assets/audio/classic-song.mp3');
        // this.load.audio('bounce','assets/audio/bounce.mp3');

    }

    create ()
    {   
        const width = this.scale.width;
        const height = this.scale.height;
        this.physics.world.setBounds(0, 0, 1000, 800); 
        var gameOver = false;
        var score = 0;
        var scoreText;
        // add bgm 
        // this.bgm = this.sound.add('bgm');
        // this.lose = this.sound.add('lose');
        // this.win = this.sound.add('win');

        // play bgm
        //this.bgm.play();

        //add background image
        this.bg = this.add.image(0,0,'bg');
        this.bg.setScale(1.5);

        this.text = this.add.text(10, 10, 'Health: 100', { font: '32px Courier', fill: '#000000' });


        // The player and its settings
        this.player = this.physics.add.sprite(0, 1080, 'player');
        //this.player.setSize(8,8);
        this.player.setScale(0.05);
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setCollideWorldBounds(true);

        //create camera 
        this.cameras.main.setBounds(0, 0, 2160, 1080);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setSize(800,600);
        // this.cameras.zoom = 3;

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.reset = this.input.keyboard.addKey('R');


       




    }

    update ()
    {

         const cam = this.cameras.main;
        // const speed = 5;

        if (this.gameOver)
        {
            this.physics.pause();
            this.player.play('turn');
        }   

        this.text.setText('Health: 10000000');

        this.player.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-200);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(200);
        }

        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-200);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(200);
        }

        if(this.reset.isDown){
            // this.bgm.stop();
            // this.win.stop();
            // this.lose.stop();
           // this.physics.resume();
            this.gameOver = false;
            this.scene.restart();
        }
    }

}





const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true        
        }
    },
    scene: MyScene
});
