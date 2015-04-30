/**
 * Created by b00237669 on 03/04/2015.
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-page', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('sky', 'Images/sky.png');
    game.load.image('ground', 'Images/ground.png');
    game.load.image('platform', 'Images/platform.png');
    game.load.image('star', 'Images/star.png');
    game.load.image('finish', 'Images/finish.png');
    game.load.image('enemy', 'Images/enemy.png');
    game.load.image('logo', 'Images/logo.png');
    game.load.image('end', 'Images/logo2.png');
    game.load.image('dead', 'Images/dead.png');
    game.load.spritesheet('player', 'Sprites/dude.png', 32, 48);
}

var player;
var enemySpeed = 50;
var platforms;
var score = 0;
var lives = 3;
var background;

function addPlatform(PosX, PosY, asset){
    ledge = game.add.sprite(PosX, PosY, asset);
    game.physics.enable(ledge, Phaser.Physics.ARCADE);
    ledge.body.allowGravity = false;
    ledge.body.immovable = true;
    platforms.add(ledge);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE); //Enabling Physics

    game.world.setBounds(0, 0, 2000, 600);

    background = game.add.tileSprite(0, 0, 800, 600, 'sky');
    background.fixedToCamera = true;

    platforms = game.add.group();   //Platform group
    platforms.enableBody = true;    //Enable physics for the group

    var ground = platforms.create(0, game.world.height - 64, 'ground');     //The Ground
    ground.scale.setTo(3.5,1);    //Scale the ground
    ground.body.immovable = true;

    ground = platforms.create(game.world.width/2, game.world.height - 64, 'ground');
    ground.scale.setTo(3.5,1);    //Scale the ground
    ground.body.immovable = true;

//Platforms
    addPlatform(400, 425, 'platform');
    addPlatform(700, 310, 'platform');
    addPlatform(900, 190, 'platform');
    addPlatform(900, 425, 'platform');
    addPlatform(1080, 310, 'platform');
    addPlatform(1400, 425, 'platform');
    addPlatform(1600, 310, 'platform');
    addPlatform(1850, 190, 'platform');

    logo = game.add.sprite(0, 0, 'logo');
    logo.fixedToCamera = true;
    game.input.onDown.add(removeLogo, this);
    game.paused = true;

    player = game.add.sprite(32, game.world.height - 150, 'player');    //The player
    game.physics.arcade.enable(player);     //Player Physics

    //  Player physics properties.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Walking left and right
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);

    var enemy = new Enemy(game, 400,385, 1, enemySpeed);
    enemy.scale.setTo(0.5, 0.5);
    enemy.body.gravity.y = 300;
    game.add.existing(enemy);

    enemy = new Enemy(game, 900, 385, 1 , enemySpeed);
    enemy.scale.setTo(0.5, 0.5);
    enemy.body.gravity.y = 300;
    game.add.existing(enemy);

    enemy = new Enemy(game, 1050, 110, 1 , enemySpeed);
    enemy.scale.setTo(0.5, 0.5);
    enemy.body.gravity.y = 300;
    game.add.existing(enemy);

    enemy = new Enemy(game, 1550, 385, 1 , enemySpeed);
    enemy.scale.setTo(0.5, 0.5);
    enemy.body.gravity.y = 300;
    game.add.existing(enemy);

    stars = game.add.group();
    stars.enableBody = true;

    var collect = stars.create(800, 390, 'star');
    collect.body.gravity.y = 100;

    collect = stars.create(550, 400, 'star');
    collect.body.gravity.y = 100;

    collect = stars.create(1000, 190, 'star');
    collect.body.gravity.y = 100;

    collect = stars.create(1100, 50, 'star');
    collect.body.gravity.y = 100;

    collect = stars.create(1250, 90, 'star');
    collect.body.gravity.y = 100;

    collect = stars.create(1670, 10, 'star');
    collect.body.gravity.y = 100;

    gOver = game.add.group();
    gOver.enableBody = true;
    var finish = gOver.create(1920, 100, 'finish');
    finish.body.gravity.y = 100;
    finish.scale.setTo(0.5,0.5);
}

function removeLogo(){
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
    game.paused = false;
}

function update() {
    //  Collide the player with the platforms
    game.physics.arcade.collide(player, platforms);

    cursors = game.input.keyboard.createCursorKeys();

    //Reset the players velocity
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //Move left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //Move right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //Allow the player to jump if touching ground
    if(cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -280;
    }

    background.tilePosition.x = -game.camera.x;
    background.tilePosition.y = -game.camera.y;

    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(gOver, platforms);

    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.overlap(player, gOver, gameOver, null, this);

    //check if player still has lives
    if (lives == 0){
        deadPlayer();
    }

    function deadPlayer(player, gOver){
        logo = game.add.sprite(0, 0, 'dead');
        logo.fixedToCamera = true;
        game.input.onDown.add(resetLevel, this);
        game.paused = true;
    }

    function collectStar(player, star){
        star.kill();
        score += 10;
    }

    function gameOver(player, gOver){
        gOver.kill();
        player.kill();
        logo = game.add.sprite(0, 0, 'end');
        logo.fixedToCamera = true;
        game.input.onDown.add(resetLevel, this);
        game.paused = true;
    }

    function resetLevel(){
        game.state.start(game.state.current);
        score = 0;
        lives = 3;
        game.paused = false;
    }
}

function render (){
    game.debug.text('score: ' + score, 16, 16);
    game.debug.text('lives: ' + lives, 700, 16);
}

//Enemies
Enemy = function (game, x, y, direction, speed){
    Phaser.Sprite.call(this, game, x, y, 'enemy');
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.xSpeed = direction * speed;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){
    game.physics.arcade.collide(this, platforms, moveEnemy);
    this.body.velocity.x = this.xSpeed;

    game.physics.arcade.overlap(this, player, loseLife, null);

    function loseLife(enemy, player){
        lives -= 1;
        enemy.kill();
    }
};

function moveEnemy(enemy, ledge){
    if(enemy.xSpeed > 0 && enemy.x > ledge.x + ledge.width * 0.8 || enemy.xSpeed < 0 && enemy.x < ledge.x - ledge.width * 0.03){
        enemy.xSpeed *= -1;
    }
}