class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }
    preload() {
        this.load.image('city', './assets/bg.png');
        this.load.image('player','./assets/player.png')
        this.load.image('floor','./assets/floor.png')
        this.load.image('car','./assets/car.png')
        this.load.image('meteor','./assets/meteor.png')
       
    }

    create() {
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.add.text(game.config.width/2, game.config.height/2, "RUNNER SCENE");
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 2;
        this.SCROLL_SPEED = 4;
        currentScene = 3;
        this.physics.world.gravity.y = 2600;
        this.cityscape = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'city').setOrigin(0);
        // make ground tiles group
        this.ground = this.add.group();
        this.player = this.physics.add.sprite(50, 450,  'player').setOrigin(.5,.5);
        for(let i = 0; i < game.config.width; i += tileSize) { 
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize,  'floor').setScale(SCALE).setOrigin(0);
            let groundTile2 = this.physics.add.sprite(i, game.config.height - tileSize+10,  'floor').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            groundTile2.body.immovable = true;
            groundTile2.body.allowGravity = false;
            this.ground.add(groundTile);
            this.ground.add(groundTile2);
        }

        this.car = this.physics.add.sprite(game.config.width, 455 ,  'car').setOrigin(0);
        this.car.body.allowGravity = false;
        this.meteor =  this.physics.add.sprite(game.config.width, Math.random()*(425-380)+380,  'meteor').setOrigin(0);
        this.meteor.body.allowGravity = false;
        // add physics collider
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.car, this.ground);
        this.enemy = this.add.group()
        this.enemy.add(this.car);
        this.enemy.add(this.meteor);
        this.gameOver = false;
        this.physics.add.collider(this.enemy, this.player, ()=>{this.gameOver=true});
        this.SCROLL_SPEED = 5;
        
    }

        
    update() {
        // update tile sprites (tweak for more "speed")


        if(this.gameOver){
            this.scene.start('menuScene');
        }


        if(!this.gameOver){
        this.car.body.setVelocityX(-300);
        this.meteor.body.setVelocityX(-400);

        this.cityscape.tilePositionX += this.SCROLL_SPEED;
        this.groundTile += this.SCROLL_SPEED;
        this.player.onGround = this.player.body.touching.down
        if(this.player.onGround){
            this.jump = 1;
            this.jumping=false;
        }

        if(this.jump>0 && Phaser.Input.Keyboard.JustDown(keySPACE)&&!keyDOWN.isDown) {
            console.log("I JUMPED POGGERS");
	        this.player.body.setVelocityY(-800);
            this.jump--;
            this.jumping=true;
        }

        if(this.car.body.x <-200){
            console.log("OFFSCREEN XD"); 

            this.car.x = game.config.width+50;
        }
        
        if(this.meteor.body.x <-200){
            console.log("OFFSCREEN XD"); 

            this.meteor.x = game.config.width+50;
            this.meteor.y = Math.random()*(425-380)+380;
        }
        
        if(keyDOWN.isDown){
            this.player.angle = 90;
            this.player.setSize(70,45);
            if(!this.jumping){
            this.player.y = 467.5;
            this.player.body.setVelocityY(0);
            }
        }
        if(Phaser.Input.Keyboard.JustUp(keyDOWN)||this.player.y>game.config.height){
            this.player.body.setVelocityY(0);
            this.player.angle = 0;
            this.player.y = 450;
            this.player.setSize(45,70);
            // this.player.x = 70;
        }
        console.log("X"+this.player.x+" Y "+this.player.y);
        console.log(this.player.body.velocity.y);
    }


}

    }