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

        //this.load.image('sky', 'assets/sky.png');
         this.load.image('ground', 'assets/pirate-map.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });


        this.load.audio('bgm','assets/audio/bgm.mp3');
        this.load.audio('lose','assets/audio/lose.mp3');
        this.load.audio('pick','assets/audio/pick.mp3');

    }

    create ()
    {   
        //this.add.image(0, 0, 'tiles');

        //create the Map
        const map = this.make.tilemap({key: 'map'})
        
        //add the tileset image we are using
        const tileset = map.addTilesetImage('Terrain (16x16)', 'tiles')

        //create the layers we want in the right order
        map.createStaticLayer('ground',tileset)


        var gameOver = false;
        var score = 0;
        var scoreText;
        // add bgm 
        this.bgm = this.sound.add('bgm');
        this.lose = this.sound.add('lose');
        this.pick = this.sound.add('pick');

        // play bgm
        this.bgm.play();

        //  A simple background for our game
        //this.add.image(400, 300, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        //this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        //this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        //  Now let's create some ledges
        //this.platforms.create(600, 400, 'ground');
        //this.platforms.create(50, 250, 'ground');
        //this.platforms.create(750, 220, 'ground');

        // The player and its settings
        this.player = this.physics.add.sprite(100, 450, 'dude');

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        //  The score
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //  Collide the player and the star with the platforms
        //this.physics.add.collider(this.player, this.platforms);

        //  Checks to see if the player overlaps with any of the star, if he does call the collectStar function
    }

    update ()
    {
        if (this.gameOver)
        {
            return;
        }

        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }
}




const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: MyScene
});
