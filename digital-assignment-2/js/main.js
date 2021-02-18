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
var sprite;
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
        this.load.image('cat', 'assets/characters/player_handgun.png');
        this.load.image('health', 'assets/pt.png');
        this.load.image('bg', 'assets/background/sand.jpg');
        this.load.image('oasis', 'assets/oasis.png');

        // preload sound
        this.load.audio('bgm','assets/audio/bgm2.mp3');
        this.load.audio('pick','assets/audio/pick.mp3');
        this.load.audio('win','assets/audio/classic-song.mp3');
        this.load.audio('lose','assets/audio/sad-song.mp3');

    }

    create ()
    {
        //add sounds
        bgm = this.sound.add('bgm');
        pick = this.sound.add('pick');
        win = this.sound.add ('win');
        lose = this.sound.add('lose');
        bgm.play();

        this.add.image(0,0,'bg');
        sprite = this.physics.add.image(400, 300, 'cat');

        sprite.setCollideWorldBounds(true);

        oasis = this.physics.add.group();

        //  Create 10 random health pick-ups
        healthGroup = this.physics.add.staticGroup({
            key: 'health',
            frameQuantity: 10,
            immovable: true
        });

        var children = healthGroup.getChildren();

        for (var i = 0; i < children.length; i++)
        {
            var x = Phaser.Math.Between(50, 750);
            var y = Phaser.Math.Between(50, 550);

            children[i].setPosition(x, y);
        }

        healthGroup.refresh();

        //  So we can see how much health we have left
        text = this.add.text(10, 10, 'Health: 100', { font: '32px Courier', fill: '#000000' });

        //  Cursors to move
        cursors = this.input.keyboard.createCursorKeys();

        //  When the player sprite his the health packs, call this function ...
        this.physics.add.overlap(sprite, healthGroup, spriteHitHealth);



        // Spawn Oasis after a time
        spawnOasisTime = Phaser.Math.Between(4, 8);
        console.log('spawn oasis in ' + spawnOasisTime);
        oasisTimedEvent = this.time.addEvent({ delay: spawnOasisTime*1000, callback: spawnOasis, callbackScope: this, loop: false });

        //  When the player sprite his the oasis, call this function ...
        this.physics.add.overlap(sprite, oasis, spriteHitOasis);
        
        //  Decrease the health by calling reduceHealth every 50ms
        timedEvent = this.time.addEvent({ delay: 50, callback: reduceHealth, callbackScope: this, loop: true });

    }

    update ()
    {

        if (gameOver === true){

            return;
        }   
        if (currentHealth === 0)
        {
            return;
        }

        text.setText('Health: ' + currentHealth);

        sprite.setAcceleration(0);

        if (cursors.left.isDown)
        {
            sprite.setAccelerationX(-200);
        }
        else if (cursors.right.isDown)
        {
            sprite.setAccelerationX(200);
        }

        if (cursors.up.isDown)
        {
            sprite.setAccelerationY(-200);
        }
        else if (cursors.down.isDown)
        {
            sprite.setAccelerationY(200);
        }
    }
}
function spawnOasis(){
    oasisTimedEvent.remove(); 
    var x = Phaser.Math.Between(50, 750);
    var y = Phaser.Math.Between(50, 550);
    oasis.create(x, y, 'oasis');
}

function reduceHealth ()
{
    currentHealth --;

    if (currentHealth === 0)
    {
        //  Uh oh, we're dead
        sprite.body.reset(400, 300);

        text.setText('You run out of water. ');
        bgm.pause();
        lose.play();
        //  Stop the timer
        timedEvent.remove();
        oasisTimedEvent.remove();
    }
}

function spriteHitHealth (sprite, health)
{
    //  Hide the sprite
    healthGroup.killAndHide(health);
    pick.play();
    //  And disable the body
    health.body.enable = false;

    //  Add 10 health, it'll never go over maxHealth
    currentHealth = Phaser.Math.MaxAdd(currentHealth, 10, maxHealth);

    if (healthGroup.countActive(true) === 0) {
        healthGroup.children.iterate(function (child) {

            child.enableBody(true, child.x, child.y, true, true);

        });
    }
}
function spriteHitOasis(sprite){
    text.setText('You found the oasis.');
    sprite.body.reset(400, 300);
    bgm.pause();
    win.play();     
    timedEvent.remove();
    oasisTimedEvent.remove();
    gameOver = true;
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene: MyScene,
    physics: { default: 'arcade' },
    });
