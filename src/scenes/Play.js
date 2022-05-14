class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }
    preload() {
        this.load.image('city2', './assets/bg2.png');
        this.load.image('player','./assets/player.png')
        this.load.image('floor','./assets/floor.png')
        this.load.image('car','./assets/van_1.png')
        this.load.image('meteor','./assets/meteor.png')
        this.load.image('shield','./assets/shield.png')
        // this.load.atlas('player_atlas', './assets/playersheet.png', './assets/playermap.json');
        this.load.atlas('player_atlas2', './assets/playersheet2.png', './assets/playersheet2.json');
        this.load.atlas('duck_atlas', './assets/playersheet_duck.png', './assets/playersheet_duck.json');
       
    }

    create() { 
        
        // add sfx / music
        this.jump_sound = this.sound.add('jump');
        this.hit = this.sound.add('hit');
        this.shield_get = this.sound.add('shield');
        this.shield_off = this.sound.add('off');
        this.duck = this.sound.add('duck');
        this.slide = this.sound.add('slide');
        this.bgm = this.sound.add('bgm');

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // set some variables
        this.JUMP_VELOCITY = -700;
        this.scrollSpeed = 5;
        this.speedMult = 1;
        this.physics.world.gravity.y = 2600;
        this.state = "behind";                  // state of player's x position
        this.CAR_SCALE = 0.15;
        this.CAR_VEL_MIN = 350;
        this.CAR_VEL_MAX = 450;
        this.METEOR_SCALE = 0.2;
        this.METEOR_VEL_MIN = 650;
        this.METEOR_VEL_MAX = 800;

        this.SHIELD_SCALE = 2;
        

        // background
        this.cityscape = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'city2').setOrigin(0);

        // make collision groups
        this.ground = this.add.group();
        this.enemy = this.add.group();

        // create player
        this.player = this.physics.add.sprite(100, 450, 'player_atlas2', 'run_0001').setInteractive(this.input.makePixelPerfect()).setOrigin(1);
        this.player.body.allowGravity = true;

        // create shield on player
        this.trash = this.add.sprite(50, 450, 'shield').setScale(2);
        this.trash.alpha= 0;

        // make shield item
        this.shield = this.physics.add.sprite(-50, 200 , 'shield').setScale(2).setOrigin(0);
        this.shield.body.allowGravity = false;

        // top border for text
        // this.border = this.add.rectangle(0, 0, game.config.width, 75, '0x3F48CC').setOrigin(0);
        // this.border.alpha = 0;

        // player health
        this.p1Health = 1;

        // make ground tiles
        this.floor = this.physics.add.sprite(-game.config.width/2, game.config.height-25, 'floor').setOrigin(0);
        this.floor.body.immovable = true;
        this.floor.body.allowGravity = false;
        this.floor.setDepth(1);
        this.floor.alpha = 0;
        this.floor2 = this.physics.add.sprite(game.config.width/2, game.config.height-25, 'floor').setOrigin(0);
        this.floor2.body.immovable = true;
        this.floor2.body.allowGravity = false;
        this.floor2.setDepth(1);
        this.floor2.alpha = 0;
        this.ground.add(this.floor);

        // car obj
        this.car = this.physics.add.sprite(game.config.width, game.config.height - 60 ,  'car').setOrigin(0.5);
        this.car.setScale(this.CAR_SCALE, this.CAR_SCALE);
        this.car.setSize(this.car.width-10, this.car.height/2);
        this.hood = this.physics.add.sprite(game.config.width, game.config.height - 90 , 'car').setOrigin(0.5);
        this.hood.alpha = 0;
        this.hood.setSize(this.car.width * this.CAR_SCALE - 20, 40);
        this.hood.setDisplaySize(this.car.width, 40);
        this.car.body.allowGravity = false;
        this.hood.body.allowGravity = false;
        this.hood.body.immovable = true;
        
        // meteor obj
        this.meteor =  this.physics.add.sprite(game.config.width, Math.random()*(425-380)+380,  'meteor').setOrigin(0);
        this.meteor.body.allowGravity = false;
        this.meteor.scale = this.METEOR_SCALE;
        this.meteor.setSize(200, 160);
        this.meteor.setOffset(-10, 100);
        
        // add enemies to group
        this.enemy = this.add.group();
        this.meteors = this.add.group();
        this.enemy.add(this.car);
        this.enemy.add(this.meteor);
        this.meteors.add(this.meteor)
        
        // add physics collider
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.car, this.ground);
        this.shield_col = this.physics.add.collider(this.shield, this.player, ()=>{
            this.shield_get.play();
            this.trash.alpha= 1;
            this.shield.x = -50;
            this.shield.y = 200;
            if(this.p1Health==1){
            this.p1Health++;
            }
            this.shield.body.setVelocityX(0);
            this.shield.body.setVelocityY(0);
        });
        this.shield_col.overlapOnly = true;
        this.physics.add.collider(this.car, this.player, ()=>{
            this.trash.alpha= 0;
            this.car_reset();
            if(this.p1Health>1){
                this.shield_off.play();
            }else{
                this.hit.play();  
            }

            if(this.p1Health==2){
                this.p1Health = 1;
            }else if(this.p1Health == 1){
                this.p1Health = 0;
            }
        });
        this.physics.add.collider(this.meteors, this.player, ()=>{
            this.trash.alpha= 0;
            this.meteor_reset();
            if(this.p1Health>1){
                this.shield_off.play();
            }else{
                this.hit.play();  
            }
            
            if(this.p1Health==2){
                this.p1Health = 1;
            }else if(this.p1Health == 1){
                this.p1Health = 0;
            }
        });

        this.onHood = false;
        
        this.physics.add.collider(this.player, this.hood, ()=>{
            this.player.body.setVelocityY(0);
            this.onHood = true;
            // this.player.body.setVelocityX(-1*this.hood.body.velocity.x+300);
        });

        
        // game over variable 
        this.gameOver = false;

        // starting vel for enemy objs
        this.car.body.setVelocityX(-this.CAR_VEL_MIN);
        this.hood.body.setVelocityX(-this.CAR_VEL_MIN);
        this.meteor.body.setVelocityX(-this.METEOR_VEL_MIN);

        // text config
        let textConfig = {
            fontFamily: 'Alagard',
            fontSize: '40px',
            color: '#cdcdcd',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        let dropshadow = {
            fontFamily: 'Alagard',
            fontSize: '40px',
            color: '#505050',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        // SCORING
        this.score = 0;
        this.scoreRightDropshadow = this.add.text(12, 12, "Distance: "+this.score+" mi", dropshadow).setOrigin(0);
        this.scoreRight = this.add.text(10, 10, "Distance: "+this.score+" mi", textConfig).setOrigin(0);

        this.time.addEvent({ delay: 500, callback: this.miles, callbackScope: this, loop: true });

        this.highScoreShadow = this.add.text(game.config.width-8, 12, "High Score: "+highScore+" mi", dropshadow).setOrigin(1,0);
        this.highScoreDisplay = this.add.text(game.config.width-10, 10, "High Score: "+highScore+" mi", textConfig).setOrigin(1,0);

        // game over text setup
        this.gameOverDisplay = this.add.text(game.config.width/2 + 2, game.config.height/2 + 2, '', dropshadow).setOrigin(0.5);
        this.gameOverShadow = this.add.text(game.config.width/2, game.config.height/2, '', textConfig).setOrigin(0.5);

        // powerup spawn
        this.time.addEvent({ delay: 8000, callback: this.shieldSpawn, callbackScope: this, loop: true });

        // play bgm
        this.bgm.setLoop(true);
        this.bgm.play();

        // player animations
        // this.anims.create({
        //     key: 'run',
        //     frames: this.anims.generateFrameNames('player_atlas', {
        //         prefix: 'run_',
        //         start: 1,
        //         end: 8,
        //         suffix: '',
        //         zeroPad: 4
        //     }),
        //     frameRate: 15,
        //     repeat: -1
        // });

        this.running =this.anims.create({
            key: 'run2',
            frames: this.anims.generateFrameNames('player_atlas2', {
                prefix: 'run_',
                start: 1,
                end: 8,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.ducking =this.anims.create({
            key: 'duck',
            frames: this.anims.generateFrameNames('duck_atlas', {
                prefix: 'duck_',
                start: 1,
                end: 6,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });


        this.anims.addMix('run2', 'duck',100);
        this.anims.addMix('duck', 'run2', 100);

        // this.anims.create({
        //     key: 'duck',
        //     frames: this.anims.generateFrameNames('player_atlas', {
        //         prefix: 'duck_',
        //         start: 1,
        //         end: 5,
        //         suffix: '',
        //         zeroPad: 4
        //     }),
        //     frameRate: 15,
        //     repeat: -1
        // });

        // difficulty increase after 15 sec
        this.nighttime = this.time.delayedCall(21500, () => {
            if (!this.gameOver) {
                this.player.setDepth(1);
                this.meteor.setDepth(1);
                this.car.setDepth(1);
                this.hood.setDepth(1);
                this.shield.setDepth(1);
                this.trash.setDepth(1);
                // this.border.alpha = 1;
                // this.border.setDepth(1);
                this.scoreRightDropshadow.setDepth(1);
                this.scoreRight.setDepth(1);
                this.highScoreShadow.setDepth(1);
                this.highScoreDisplay.setDepth(1);
                this.gameOverDisplay.setDepth(1);
                this.gameOverShadow.setDepth(1);
                this.cityscape.setDepth(0);
                this.scrollSpeed +=3;
                this.speedMult = 1.3;
            }
        }, null, this);

    }

        
    update() {
        // game ending handling
        if(this.gameOver){
            // stop bgm
            this.bgm.setLoop(false);
            this.bgm.stop();
            this.slide.setLoop(false);

            // freeze all arcade sprites
            this.car.body.setVelocityX(0);
            this.hood.body.setVelocityX(0);
            this.meteor.body.setVelocityX(0);
            this.shield.body.setVelocityX(0);
            this.player.body.allowGravity = false;
            this.player.anims.stop();
            this.player.body.setVelocityX(0);
            this.player.body.setVelocityY(0);

            // update high score
            if (this.score>highScore) {
                highScore = Phaser.Math.RoundTo(this.score, -1);
            }

            // display game over text
            this.gameOverDisplay.text = 'Game Over\nLEFT to Retry, RIGHT to Menu';
            this.gameOverShadow.text = 'Game Over\nLEFT to Retry, RIGHT to Menu';

            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.sound.play('select');
                this.scene.restart();
            }
            else if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
                this.sound.play('select');
                this.scene.start('menuScene');
            }
            
        }


        // what to do in game runtime
        if(!this.gameOver){
            console.log(this.player.anims.getName());
                
            // make bg scroll
            this.cityscape.tilePositionX += this.scrollSpeed;

            // check for player touching ground
            this.player.onGround = this.player.body.touching.down;
            this.player.play('run2',true);
            this.player.setSize(45,100);
            this.player.setDisplaySize(45,70);

            // console.log(this.player.anims.currentFrame.index);
            // console.log(this.player.anims);

           

            // tracking player x position
            if(this.player.x<150){
                this.state = "behind";
            
            }else if(this.player.x>200){
                this.state = "ahead";
            }
            else{
                this.state = "zone"; // zone is [150, 200]
            }
            
            if(this.player.onGround){
                this.jump = 1;
                this.jumping = false;
            }
            
            switch(this.state){
                case "behind":
                    this.player.body.velocity.x = this.onHood ? 150 : 20;
                    break;
                case "ahead":
                    this.player.body.velocity.x = -20;
                    break;
                case "zone":
                    this.player.body.velocity.x = 0;
                    break;
            }

            if (this.player.y > game.config.height - 30 && this.player.onGround) {
                this.onHood = false;
            }

            // console.log(this.player.body.velocity.x);
          
            

            // jumping controller
            if(this.jump>0 && Phaser.Input.Keyboard.DownDuration(keySPACE,100)&&!keyDOWN.isDown) {
                this.jump_sound.play();
                this.player.body.setVelocityY(-800);
                this.jumping=true;
            }
            if(this.jumping && keyDOWN.isUp) {
                this.jump--;
                this.jumping = false;
            }


            // reset things when they go off screen
            if(this.car.body.x <-300){
                this.car_reset();
            }
            
            if(this.meteor.body.x <-200||this.meteor.body.velocity.x==0){
                this.meteor_reset();
            }

            // controlling the ducking
            if (keyDOWN.isDown && this.player.y > game.config.height - 30){
                if(Phaser.Input.Keyboard.JustDown(keyDOWN)) {

                    
                this.player.play('duck', true);
                this.duck.play(); 
                this.slide.setLoop(true);
                this.slide.play();
                }
                
                this.player.setSize(65,40);
                //this.player.setDisplaySize(45,70);
                
                if(!this.jumping) {
                    this.player.body.setVelocityY(700);
                }
                
            }


            // resetting after done ducking
            if(Phaser.Input.Keyboard.JustUp(keyDOWN) && this.player.y > game.config.height - 30){

                if (this.player.anims.getName() === 'duck'){
    
                    this.player.stop('duck',true);
                    this.player.play('run2',true);
                }
                this.slide.setLoop(false);
                this.slide.stop();
                
                if (this.player.onGround) {
                    this.player.y = 500;
                    this.player.body.setVelocityY(0);
                }

            }

            if(this.player.y>game.config.height) {
                this.player.y = 500; 
                this.player.body.setVelocityY(0);
            }

            // put shield sprite on player
            if(this.p1Health>1){
                this.trash.x = this.player.x+10;
                this.trash.y = this.player.y-30;
            }

            // when player health reaches 0 or off screen, end the game
            if(this.p1Health <= 0 || this.player.x< - 40){
                this.gameOver = true;
            }
        }  
    }


    // updates the score 
    miles(){
        if (!this.gameOver) {
            this.score += 0.1;
            this.scoreRight.text = "Distance: "+ Phaser.Math.RoundTo(this.score, -1) + " mi";
            this.scoreRightDropshadow.text = "Distance: "+ Phaser.Math.RoundTo(this.score, -1) + " mi";
        }
    }


    // spawn the shield
    shieldSpawn(){
        if(this.p1Health==1&&this.shield.x<0 && !this.gameOver){
            this.shield.x = game.config.width + 50;
            this.shield.y =  Math.random()*(455-380)+380
            this.shield.body.setVelocityX(-200);
            this.shield.body.setVelocityY(0);
        }
    }


    // reset the meteor 
    meteor_reset(){
        this.meteor.destroy();
        this.meteor = this.physics.add.sprite(game.config.width, Math.random()*(425-380)+380,  'meteor').setOrigin(0);
        this.meteor.scale = this.METEOR_SCALE;
        this.meteor.setSize(200, 160);
        this.meteor.setOffset(-10, 100);
        this.meteor.body.allowGravity = false;
        this.meteor.x = game.config.width+(Math.random()*(300-25)+25);
        this.meteor.setVelocityY(0);
        this.meteor.setVelocityX((-1*((Math.random()*(this.METEOR_VEL_MAX - this.METEOR_VEL_MIN) + this.METEOR_VEL_MIN)))*this.speedMult);
        this.meteor.y = Math.random()*(410-350)+350;
        this.meteors.add(this.meteor);

    }


    // reset the car
    car_reset(){
        this.car.y = game.config.height - 60;
        this.car.x = game.config.width+(Math.random()*(1000-25)+25);
        this.num = (-1*((Math.random()*(this.CAR_VEL_MAX - this.CAR_VEL_MIN) + this.CAR_VEL_MIN)))*this.speedMult;
        this.car.body.setVelocityX(this.num);
        this.hood.x = this.car.x;
        this.hood.body.setVelocityX(this.num);

    }

}
