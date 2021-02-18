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

class MyScene extends Phaser.Scene {

    preload ()
    {
        this.load.image('cat', 'assets/characters/player_handgun.png');
        this.load.image('health', 'assets/target.png');
    }

    create ()
    {
        sprite = this.physics.add.image(400, 300, 'cat');

        sprite.setCollideWorldBounds(true);

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

        //  Decrease the health by calling reduceHealth every 50ms
        timedEvent = this.time.addEvent({ delay: 50, callback: reduceHealth, callbackScope: this, loop: true });
    }

    reduceHealth ()
    {
        currentHealth--;

        if (currentHealth === 0)
        {
            //  Uh oh, we're dead
            sprite.body.reset(400, 300);

            text.setText('Health: RIP');

            //  Stop the timer
            timedEvent.remove();
        }
    }

    spriteHitHealth (sprite, health)
    {
        //  Hide the sprite
        healthGroup.killAndHide(health);

        //  And disable the body
        health.body.enable = false;

        //  Add 10 health, it'll never go over maxHealth
        currentHealth = Phaser.Math.MaxAdd(currentHealth, 10, maxHealth);
    }

    update ()
    {
        if (currentHealth === 0)
        {
            return;
        }

        text.setText('Health: ' + currentHealth);

        sprite.setVelocity(0);

        if (cursors.left.isDown)
        {
            sprite.setVelocityX(-200);
        }
        else if (cursors.right.isDown)
        {
            sprite.setVelocityX(200);
        }

        if (cursors.up.isDown)
        {
            sprite.setVelocityY(-200);
        }
        else if (cursors.down.isDown)
        {
            sprite.setVelocityY(200);
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
