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
    {   //load background and ground layer
        this.load.image('bg', 'assets/scroll/background.png');
        this.load.image('ground', 'assets/pirate-map.png');

        //load scrolling image
        this.load.image('hill1', 'assets/scroll/hill1.png');
        this.load.image('mountain', 'assets/scroll/mountain.png');
        this.load.image('cloud', 'assets/scroll/cloud.png');

        //load character
        this.load.spritesheet('dude-right', 'assets/character/captain-run1.png', { frameWidth: 32, frameHeight: 32 });
        //this.load.spritesheet('attack', 'assets/character/attack/attack.png', { frameWidth: 64, frameHeight: 40 })

        //load enemies
        this.load.spritesheet('whale', 'assets/character/whale-fall.png', { frameWidth: 66, frameHeight: 40 });
        this.load.spritesheet('rino', 'assets/character/rino.png', { frameWidth: 52, frameHeight: 30 });
        this.load.spritesheet('slime', 'assets/character/slime-run.png', { frameWidth: 44, frameHeight: 30 })

        //load chest image
        this.load.image('chest', 'assets/chest.png');

        //load audio
        this.load.audio('bgm','assets/audio/bgm.mp3');
        this.load.audio('lose','assets/audio/sad-song.mp3');
        this.load.audio('win','assets/audio/classic-song.mp3');
        this.load.audio('bounce','assets/audio/bounce.mp3');

    }

    create ()
    {   
        const count = 10;
        let groundX = 400;
        const width = this.scale.width;
        const height = this.scale.height;

        var gameOver = false;
        var score = 0;
        var scoreText;
        // add bgm 
        this.bgm = this.sound.add('bgm');
        this.lose = this.sound.add('lose');
        this.win = this.sound.add('win');
        this.bounce = this.sound.add('bounce');

        // play bgm
        this.bgm.play();
        console.log("reset");
        //  create scrolling background
        createAligned(this, count, 'bg', 0.5);
        createAligned(this, count, 'mountain', 0.5);
        createAligned(this, count, 'cloud', 0.25);
        createAligned(this, count, 'hill1', 0.75);

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.physics.add.staticGroup();
        //this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        //  Here we create the ground.
        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        this.platforms.create(0, 568, 'ground').setScale(2).refreshBody();
        
        // for loop to create more platforms
        for (var i = 0; i <10; i++) {
            this.platforms.create(groundX, 568, 'ground').setScale(2).refreshBody();
            groundX+= 400; 
        }
        //set world bounds
        this.physics.world.bounds.x = 100;
        this.physics.world.bounds.width = groundX;

        //add chest in the end of game
        this.chest = this.physics.add.image(groundX- 500,500,'chest').setScale(1.5);

        // The player and its settings
        this.player = this.physics.add.sprite(200, 450, 'dude-right',2);
        this.player.setSize(16,30);
        this.player.setScale(2).setBounce(0.2);
        this.player.setCollideWorldBounds(true);


        //  Player physics properties. Give the little guy a slight bounce.
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
            frames: [ { key: 'dude-right', frame: 2}],
            frameRate: 10
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude-right', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'attack',
        //     frames: [ { key: 'attack', frame: 1}],
        //     frameRate: 10
        // });

        //whale animation
        this.anims.create({
            key: 'whale-anims',
            frames: this.anims.generateFrameNumbers('whale', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        // rino animation 
        this.anims.create({
            key: 'rino-anims',
            frames: this.anims.generateFrameNumbers('rino', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'slime-anims',
            frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });


        //crete enemy whale 
        this.whale = this.physics.add.sprite(Phaser.Math.Between(0,width),0,'whale')
        .setSize(32,5)
        .setVelocity(0,Phaser.Math.Between(3,6)*100)
        .setBounce(1);
        
        this.whale.body.setAllowGravity(false); // disable whale gravity
        this.whale.anims.play('whale-anims', true);

        this.whale2 = this.physics.add.sprite(Phaser.Math.Between(0,width),0,'whale')
        .setSize(32,5)
        .setVelocity(0,Phaser.Math.Between(3,6)*100)
        .setBounce(1);
        
        this.whale2.body.setAllowGravity(false); // disable whale gravity
        this.whale2.anims.play('whale-anims', true);

        // this.whale3 = this.physics.add.sprite(Phaser.Math.Between(0,width),0,'whale')
        // .setSize(32,5)
        // .setVelocity(Phaser.Math.Between(-2,2) *-100,Phaser.Math.Between(3,6)*100)
        // .setBounce(1);
        
        // this.whale3.body.setAllowGravity(false); // disable whale gravity
        // this.whale3.anims.play('whale-anims', true);

        // this.whale4 = this.physics.add.sprite(Phaser.Math.Between(0,width),0,'whale')
        // .setSize(32,5)
        // .setVelocity(Phaser.Math.Between(-2,2) *100,Phaser.Math.Between(3,6)*100)
        // .setBounce(1);
        
        // this.whale4.body.setAllowGravity(false); // disable whale gravity
        // this.whale4.anims.play('whale-anims', true);
        //create enemy rino
        this.rino = this.physics.add.sprite(0, 450, 'rino')
        .setSize(34,24)
        .setScale(2);
        //.setAccelerationX(-300);
        this.rino.anims.play('rino-anims', true);


        this.slime = this.physics.add.sprite(800, 450, 'slime')
        .setSize(30,20)
        .setScale(2)
        .setVelocityX(-100);
        this.slime.anims.play('slime-anims', true);

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.reset = this.input.keyboard.addKey('R');
        this.space = this.input.keyboard.addKey('SPACE');


        // //  The score
        // scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        //  Collide the player and the star with the platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.platforms);

        //collide rino with platform and player 
        this.physics.add.collider(this.rino, this.platforms);
        this.physics.add.collider(this.player, this.rino, this.getHit,null,this);

        // collide whale with player
        this.physics.add.collider(this.player, this.whale, this.getHit,null,this);
        this.physics.add.collider(this.player, this.whale2, this.getHit,null,this);
        // this.physics.add.collider(this.player, this.whale3, this.getHit,null,this);
        // this.physics.add.collider(this.player, this.whale4, this.getHit,null,this);

        //collide slime with platform
        this.physics.add.collider(this.slime, this.platforms);
        this.physics.add.collider(this.player, this.slime, this.getHit,null,this);

        // collide whale with platforms
        this.physics.add.collider(this.whale, this.platforms, this.playBounceSFX,null,this);
        this.physics.add.collider(this.whale2, this.platforms, this.playBounceSFX,null,this);
        // this.physics.add.collider(this.whale3, this.platforms, this.playBounceSFX,null,this);
        // this.physics.add.collider(this.whale4, this.platforms, this.playBounceSFX,null,this);

        // collide  chest with platformsr
        this.physics.add.collider(this.chest, this.platforms);
        
        // chest can also overlap with player to win the game
        this.physics.add.overlap(this.player, this.chest, this.getChest,null,this);

        //create camera 
        this.cameras.main.setBounds(100, 0, width *11, height);



    }

    update ()
    {

        this.whaleDrop(this.whale,this.player.x);
        this.whaleDrop(this.whale2,this.player.x);
        // this.whaleDrop(this.whale3,this.player.x);
        // this.whaleDrop(this.whale4,this.player.x);
        //console.log("player.x" +this.player.x);
        if (this.player.x > 1000) 
        {
            this.rinoTurn(this.rino,this.player.x);
        }
        this.slimeJump(this.slime, this.player.x);



        const cam = this.cameras.main;
        const speed = 5;
        if (this.gameOver)
        {
            this.physics.pause();
            this.player.play('turn');
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

        if (this.space.isDown){
            this.player.anims.play('attack');
        }

        if(this.reset.isDown){
            this.bgm.stop();
            this.win.stop();
            this.lose.stop();
            this.physics.resume();
            this.gameOver = false;
            this.scene.restart();

        }
    }

    slimeJump(slime, playerX){
        if(slime.body.blocked.down)
        {
            slime.setVelocity(-100,-400);
        }
        if(slime.x < 100){
            slime.x = playerX +800;        
        }
    }

    whaleDrop (whale,playerX){

        if(whale.y > this.scale.height)
        {
            whale.y = 0;
            whale.x = Phaser.Math.Between(playerX-400,playerX+400);
            whale.setVelocity(0,Phaser.Math.Between(3,6)*100)
        }
        if (whale.y < 0)
        {
            whale.y = 0;
            whale.x = Phaser.Math.Between(playerX-400,playerX+400);
            whale.setVelocity(0,Phaser.Math.Between(3,6)*100)
        }
    }
    rinoTurn(rino, playerX){
        rino.flipX = true;
        rino.setAccelerationX(100);
          if (rino.x > playerX+500)
        {
            rino.setVisible(false);
        }

    }
    playBounceSFX()
    {
        this.bounce.play();
    }

    getHit(){
        this.bgm.stop();
        this.lose.play();
        let style = { font: "30px Tahoma", fill: "#000000", align: "center" };
        let text = this.add.text( this.player.x, this.player.y-168, "You Lose\n Press R to Play Again", style );
        this.gameOver = true;
    }
    getChest(){
        this.bgm.stop();
        this.win.play();
        let style = { font: "30px Tahoma", fill: "#000000", align: "center" };
        let text = this.add.text( this.player.x-200, this.player.y-168, "Congratulation!\nYou Found The Treasure Chest", style );
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
            gravity: { y: 600},
            debug: true        
        }
    },
    scene: MyScene
});
