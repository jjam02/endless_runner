class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }
    preload() {
        this.load.image('city', './assets/bg.png');
        this.load.image('player','./assets/player.png')
        this.load.image('floor','./assets/floor.png')
        this.load.image('car','./assets/car.png')
       
    }

    create() {
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(game.config.width/2, game.config.height/2, "RUNNER SCENE");
        this.JUMP_VELOCITY = -700;
        this.MAX_JUMPS = 2;
        this.SCROLL_SPEED = 4;
        currentScene = 3;
        this.physics.world.gravity.y = 2600;
        this.cityscape = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'city').setOrigin(0);
        // make ground tiles group
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) { 
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize,  'floor').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        this.car = this.physics.add.sprite(100, 0,  'car').setOrigin(0);
        this.player = this.physics.add.sprite(20, 0,  'player').setOrigin(0);
        // add physics collider
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.car, this.ground);
        this.SCROLL_SPEED = 5;
        
    }

        
    update() {
        // update tile sprites (tweak for more "speed")
        this.cityscape.tilePositionX += this.SCROLL_SPEED;
        //this.floor += this.SCROLL_SPEED;
        this.player.onGround = this.player.body.touching.down
        if(this.player.onGround){
            console.log("IM ON THE GROUND");
            this.jump = 1;
        }

        if(this.jump>0 && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            console.log("I JUMPED POGGERS");
	        this.player.body.setVelocityY(-700);
            this.jump--;
        }

        

}
    }