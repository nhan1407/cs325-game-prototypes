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

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#3A3D3F',
    width: 800,
    height: 600,
    physics: { 
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }

    },
    scene: {
        preload : preload,
        create : create, 
        update : update,
        extend : {
            player: null, 
            healthpoints: null,
            reticle: null,
            moveKeys: null, 
            playerBullets: null,
            enemyBullets: null,
            time: 0,
        }
    }
};
var playerBullets;
var enemyBullets;
var player;
var enemy;
var reticle;
var hp1;
var hp2;
var hp3;
var moveKeys;
var playerHealth = 3;
var enemyHealth = 3;
var cursorKeys;

var game = new Phaser.Game(config);
var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    
    initialize:

    // Bullet Constructor
    function Bullet (scene){
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeet = 0;
        this.setSize (12, 12, true);
    },
    // Fire a bullet from the playter to the reticle 
    fire: function (shooter, target)
    {
        this.setPosition(shooter.x, shooter.y); // Initial position 
        this.direction = Math.atan ((target.x - this.x) / (target.y - this.y));

        // Calculate X and Y velocity of bullet to move it from shooter to target
        if (target.y >= this.y){
            this.xSpeed = this.speed * Math.sin(this.direction);
            this.ySpeed = this.speed * Math.cos(this.direction);
        }
        else {
            this.xSpeed = -this.speed * Math.sin(this.direction);
            this.ySpeed = -this.speed * Math.cos(this.direction);
        }

        this.rotation = shooter.rotation // angle bullet with shooters rotation
        this.born =0; //Time since new bullet spawned
    },
    // Updates the position of the bullet each cycle
    update: function (time,delta)
    {
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
});

function preload() {
    // Load Background + Character
    this.load.image( 'ranger', 'assets/characters/player_handgun.png',
        { frameWidth: 66, frameHeight: 60 });
    this.load.image('bullet', 'assets/bullet/bullet6.png');
    this.load.image('target', 'assets/target.png');
    

    // Load sound effects and bgm
    //this.load.audio('bgm','assets/audio/bgm.mp3');
    
    console.log('Preload finished');

    }

function create() {
    
    var outer = new Phaser.Geom.Rectangle(0, 0, 800, 600);
    var inner = new Phaser.Geom.Rectangle(350, 250, 100, 100);
    
    // Add Bullet Objects
    playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true});
    enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    
    // Set world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // Add background, player, enemy, reticle, healthpoint, sprites
    player = this.physics.add.image(800,600,'ranger');
    enemy = this.physics.add.sprite(400,300,'ranger');
    reticle = this.physics.add.sprite(800, 700, 'target');
    

    //enemy = this.physics.add.group({ collideWorldBounds: true});
    enemy.setOrigin(0.5, 0.5).setDisplaySize(132, 120);

    this.physics.moveToObject(enemy, player, 200);


    // for (var i = 0; i < 5; i++)
    // {
    //     var p = Phaser.Geom.Rectangle.RandomOutside(outer, inner);
    //     var  = enemy.create(p.x, p.y, 'ranger');

    //     this.physics.add.existing(b);

    //     //b.body.setImmovable();
    // }    

    // Set image/Sprite properties
    player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
    reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25).setCollideWorldBounds(true);

    // set sprite variables

    this.lastFired = 0;

    // Set camera properties
    this.cameras.main.zoom = 0.5;
    this.cameras.main.startFollow(player);

    // Enables movement of player with WASD keys
    // cursorKeys = this.input.keyboard.createCursorKeys();
    // cursorKeys = this.input.keyboard.addKeys(
    // {
    //     up:Phaser.Input.Keyboard.KeyCodes.W,
    //     down:Phaser.Input.Keyboard.KeyCodes.S,
    //     left:Phaser.Input.Keyboard.KeyCodes.A,
    //     right:Phaser.Input.Keyboard.KeyCodes.D
    // });


    //Fires bullet from player on left click of mouse
    this.input.on('pointerdown', function (pointer, time, lastFired){
        if (player.active === false){
            return;
        }

        // Get bullet from bullets group
        var bullet = playerBullets.get().setActive(true).setVisible(true);

        if(bullet)
        {
            bullet.fire(player, reticle);
            this.physics.add.collider(enemy, bullet, enemyHitCallback);
        }
    }, this);

    // Pointer lock will only work after mousedown
    game.canvas.addEventListener('mousedown', function (){
        game.input.mouse.requestPointerLock();
    });

    // Exit pointer lock when Q or escape (by default) is pressed
    this.input.keyboard.on('keydown_Q', function (event){
        if (game.input.mouse.locked)
            game.input.mouse.releasaePointerLock();
    }, 0, this);

    // Move reticle upon locked pointer move
    this.input.on('pointermove', function (pointer){
        if (this.input.mouse.locked)
        {
            reticle.x += pointer.movementX;
            reticle.y += pointer.movementY;
        }
    }, this);
    console.log("finish Creating");
}

function enemyHitCallback(enemyHit, bulletHit)
{
    // Reduce health of enemy
    if(bulletHit.active === true && enemyHit.active === true)
    {
        enemyHealth -= 1;
        //console.log("Enemy hp: ", enemyHealth);

        // KIll enemy if health <= 0
        if (enemyHealth <= 0)
        {
            enemyHit.setActive(false).setVisible(false);
        }

        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
    }
}

function playerHitCallback(playerHit, bulletHit)
{
    // Reduce health of player
    if (bulletHit.active === true && playerHit.active === true)
    {
        playerHealth -=1;
        console.log("Player hp: ", playerHealth);
        if (playerHealth === 0)
        {
            this.physics.pause();
            // Game over state should execute here
        }

        // Destroy bullet
        bulletHit.setActive(false).setVisible(false);
    }
}

function constrainVelocity(sprite, maxVelocity)
{
    if (!sprite || !sprite.body)
      return;

    var angle, currVelocitySqr, vx, vy;
    vx = sprite.body.velocity.x;
    vy = sprite.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity)
    {
        angle = Math.atan2(vy, vx);
        vx = Math.cos(angle) * maxVelocity;
        vy = Math.sin(angle) * maxVelocity;
        sprite.body.velocity.x = vx;
        sprite.body.velocity.y = vy;
    }
}

function constrainReticle(reticle)
{
    var distX = reticle.x-player.x; // X distance between player & reticle
    var distY = reticle.y-player.y; // Y distance between player & reticle

    // Ensures reticle cannot be moved offscreen (player follow)
    if (distX > 800)
        reticle.x = player.x+800;
    else if (distX < -800)
        reticle.x = player.x-800;

    if (distY > 600)
        reticle.y = player.y+600;
    else if (distY < -600)
        reticle.y = player.y-600;
}

function movePlayerManager()
{
    if (cursorKeys.up.isDown) 
    {
        player.setVelocity(-800);
    }
    else if (cursorKeys.down.isDown) 
    {
        player.setVelocity(800);
    }
    else {
        player.setVelocity(0);
    }
    
    if (cursorKeys.left.isDown) 
    {
        player.setVelocity(-800);
    }
    else if (cursorKeys.right.isDown) 
    {
        player.setVelocity(800);
    }
    else {
        player.setVelocity(0);
    }

}

function enemyFire(enemy, player, time, gameObject)
{
    if (enemy.active === false)
    {
        return;
    }

    if ((time - enemy.lastFired) > 1000)
    {
        enemy.lastFired = time;

        // Get bullet from bullets group
        var bullet = enemyBullets.get().setActive(true).setVisible(true);

        if (bullet)
        {
            bullet.fire(enemy, player);
            // Add collider between bullet and player
            gameObject.physics.add.collider(player, bullet, playerHitCallback);
        }
    }
}

function update (time, delta)
{
    //movePlayerManager();

    // Rotates player to face towards reticle
    player.rotation = Phaser.Math.Angle.Between(player.x, player.y, reticle.x, reticle.y);

    // Rotates enemy to face towards player
    enemy.rotation = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);

    //Make reticle move with player
    reticle.body.velocity.x = player.body.velocity.x;
    reticle.body.velocity.y = player.body.velocity.y;

    // Constrain velocity of player
    constrainVelocity(player, 500);

    // Constrain position of constrainReticle
    constrainReticle(reticle);

    // Make enemy fire
    enemyFire(enemy, player, time, this);

}


