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
        this.load.image('bound', 'assets/bound.png');
        this.load.image('off', 'assets/Off.png');
         //load background and ground layer
        //this.load.image('bg', 'assets/background/sky.jpg');
        this.load.image('player', 'assets/characters/bird.png');

        this.load.image('chest', 'assets/chest.png');

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
        var gameOver = false;
        var score = 0;
        var scoreText;
        var count =10;
        var groundX = 400;
        // add bgm 
        // this.bgm = this.sound.add('bgm');
        // this.lose = this.sound.add('lose');
        // this.win = this.sound.add('win');

        // play bgm
        //this.bgm.play();

        //add background image
        //this.bg = this.add.image(0,0,'bg');
        //this.bg.setScale(1.5);
    
        this.physics.world.bounds.x = 100;
        

        createAligned(this, count, 'bg', 0.5);
        createAligned(this, count, 'cloud', 0.5);
        

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(0, 568, 'ground').setScale(2).refreshBody();
        for (var i = 0; i <10; i++) {
            this.platforms.create(groundX, 568, 'ground').setScale(2).refreshBody();
            groundX+= 400; 
        }
        
        this.bound = this.physics.add.staticGroup();
        this.off = this.physics.add.staticGroup();



        // this.bound.create(100, 450, 'bound').refreshBody();
        // this.off.create(272, 430, 'off').refreshBody();
        // var topBoundX = 272;
        // var topBoundY = 430;
        // var bottomBoundX = 272;
        // var bottomBoundY = 518;



        // for (var i = 0; i <10; i++) {
        //     topBoundX += 38;
        //     topBoundY -= 20;
        //     this.off.create(topBoundX, topBoundY, 'off').refreshBody();
        // }

        // for (var i = 0; i <9; i++) {
        //     bottomBoundX += 38;
        //     this.off.create(bottomBoundX, bottomBoundY, 'off').refreshBody();
        //     bottomBoundY -= 20;
        // }
        // for (var i = 0; i <2; i++) {
        //     topBoundX += 38;
        //     bottomBoundX += 38;
        //     this.off.create(bottomBoundX, bottomBoundY, 'off').refreshBody();
        //     this.off.create(topBoundX, topBoundY, 'off').refreshBody();

        // }
        
        // for (var i = 0; i <10; i++) {
        //     topBoundX += 38;
        //     topBoundY += 20;
        //     this.off.create(topBoundX, topBoundY, 'off').refreshBody();
        //     this.off.create(bottomBoundX, bottomBoundY, 'off').refreshBody();
        // }

        // for (var i = 0; i <10; i++) {
        //     bottomBoundX += 38;
        //     this.off.create(bottomBoundX, bottomBoundY, 'off').refreshBody();
        //     bottomBoundY += 20;
        // }
        //     bottomBoundX += 38;
        //     bottomBoundY -= 20;

        //     this.off.create(bottomBoundX, bottomBoundY, 'off').refreshBody();


        this.chest = this.physics.add.image(500,500,'chest').setScale(1.5);
        this.physics.world.bounds.width = groundX;
        //this.text = this.add.text(100, 10, 'Health: 100', { font: '32px Courier', fill: '#000000' });


        // The player and its settings
        this.player = this.physics.add.sprite(200, 530, 'player');
        this.player.setSize(400,400);
        this.player.setScale(0.05);
        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setCollideWorldBounds(true);

        //create camera 
        //this.cameras.main.setBounds(0, 0, 2160, 1080);
        //this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setBounds(100, 0, width *11, height);

        //this.cameras.main.setSize(800,600);
        // this.cameras.zoom = 3;

        //  Input Events
        this.cursors = this.input.keyboard.createCursorKeys();
        this.reset = this.input.keyboard.addKey('R');

        //collider
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.bound,this.getHit,null,this);
        this.physics.add.collider(this.player, this.off,this.getHit,null,this);
        this.physics.add.collider(this.chest, this.platforms);

        this.physics.add.overlap(this.player, this.chest, this.getChest,null,this);




    }

    update ()
    {

         const cam = this.cameras.main;
         const speed = 1;
         cam.scrollX +=speed;

        if (this.gameOver)
        {
            this.physics.pause();
            this.player.play('turn');
        }   

        //this.text.setText('Health: 10000000');

        this.player.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-150);
            this.player.flipX = true;
            // cam.scrollX -= speed;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(150);
            this.player.flipX = false;
            // cam.scrollX +=speed;

        }

        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-100);

        }
        // else if (this.cursors.down.isDown)
        // {
        //     this.player.setVelocityY(-150);
        // }
        else {
          this.player.setAccelerationY(800);
            this.player.setVelocity(0);
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

    getHit(){
        // this.bgm.stop();
        // this.lose.play();
        let style = { font: "30px Tahoma", fill: "#000000", align: "center" };
        let text = this.add.text( this.player.x, this.player.y-168, "You Lose\n Press R to Play Again", style );
        this.gameOver = true;
    }
    getChest(){
        // this.bgm.stop();
        // this.win.play();
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
            debug: true,      
            gravity: {y :600}   
        }
    },
    scene: MyScene
});