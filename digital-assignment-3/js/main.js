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

/**
 * @param  {Phaser.Scene} scene
 * @param  {number} count 
 * @param  {string} texture 
 * @param  {nubmer} scrollFactor
 */
const createAligned = (scene, count, texture, scrollFactor) =>{
    let x = 0;
    for (let i = 0; i < count; i++) {
        const m = scene.add.image(x,scene.scale.height * 0.6, texture)
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
        this.load.image('bg', 'assets/scroll/background.png');
        this.load.image('ground', 'assets/pirate-map.png');

        //load scrolling image
        this.load.image('tree', 'assets/scroll/hill2.png');
        this.load.image('hill1', 'assets/scroll/hill1.png');
        this.load.image('mountain', 'assets/scroll/mountain.png');
        this.load.image('cloud', 'assets/scroll/cloud.png');


        //this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude-right', 'assets/character/captain-run.png', { frameWidth: 64, frameHeight: 30 });


        this.load.audio('bgm','assets/audio/bgm.mp3');
        this.load.audio('lose','assets/audio/lose.mp3');
        this.load.audio('pick','assets/audio/pick.mp3');

    }

    create ()
    {   
        const count = 100;
        let groundX = 400;
        const width = this.scale.width;
        const height = this.scale.height;

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
        createAligned(this, count, 'bg', 0.5);
        createAligned(this, count, 'mountain', 0.5);
        createAligned(this, count, 'cloud', 0.25);

        createAligned(this, count, 'hill1', 0.75);

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        for (var i = 0; i <10; i++) {
            this.platforms.create(groundX, 568, 'ground').setScale(2).refreshBody();
            groundX+= 400; 
        }

        // The player and its settings
        this.player = this.physics.add.sprite(100, 450, 'dude',0);
        this.player.setScale(2);
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        //this.player.setCollideWorldBounds(true);

        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude-right', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude-right', frame: 0 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude-right', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();

        //  The score
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        //  Collide the player and the star with the platforms
        this.physics.add.collider(this.player, this.platforms);

        //  Checks to see if the player overlaps with any of the star, if he does call the collectStar function
    
        //create camera 
        this.cameras.main.setBounds(0, 0, width *5, height);

    }

    update ()
    {
        const cam = this.cameras.main;
        const speed = 5;
        if (this.gameOver)
        {
            return;
        }

        if (this.cursors.left.isDown)
        {
            this.player.flipX = true;
            this.player.setVelocityX(-160);
            cam.scrollX -= speed;
            this.player.flipX = true;
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.flipX = false;
            cam.scrollX +=speed;
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.blocked.down)
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
