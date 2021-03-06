class Controls extends Phaser.Scene {
    constructor() {
      super("controlsScene");
    }

    preload() {
        this.load.image('player','./assets/player.png')
        this.load.image('floor','./assets/floor.png')
        this.load.image('car','./assets/van_1.png')
        this.load.image('meteor','./assets/meteor.png')
        this.load.image('shield','./assets/shield.png')
        this.load.atlas('player_atlas', './assets/playersheet.png', './assets/playermap.json');
    }

    create() {
        this.PLAYER_SCALE = 0.6;
        this.DUCK_SCALE = 0.5;
        this.CAR_SCALE = 0.15;
        this.METEOR_SCALE = 0.2;
        this.SHIELD_SCALE = 2;

        let textConfig = {
            fontFamily: 'Alagard',
            fontSize: '90px',
            color: '#5C44C2',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        let dropshadow = {
            fontFamily: 'Alagard',
            fontSize: '90px',
            color: '#221A49',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.sfx_select = this.sound.add('select');
        this.add.rectangle(0, 0, game.config.width, game.config.height, '0xaaaaaa').setOrigin(0);
        this.add.text(game.config.width/2 + 4, game.config.height/2 - 176, 'Controls', dropshadow).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - 180, 'Controls', textConfig).setOrigin(0.5);

        textConfig.fontSize = '40px';
        textConfig.color = '#000000';
        dropshadow.fontSize = '40px';
        dropshadow.color = '#505050';

        this.controlsTextShadow = this.add.text(game.config.width/2 + 2, game.config.height/2 - 90, 'Controls Splash Text', dropshadow).setOrigin(0.5);
        this.pageNumShadow = this.add.text(game.config.width/2 + 2, game.config.height/2 + 180, 'Page X / Y', dropshadow).setOrigin(0.5);

        this.controlsText = this.add.text(game.config.width/2, game.config.height/2 - 92, 'Controls Splash Text', textConfig).setOrigin(0.5);
        this.pageNum = this.add.text(game.config.width/2, game.config.height/2 + 178, 'Page X / Y', textConfig).setOrigin(0.5);

        textConfig.color = '#ffffff';
        this.add.text(game.config.width/2+2, game.config.height+2, 'LEFT / RIGHT to Navigate, SPACE for Menu', dropshadow).setOrigin(0.5,1);
        this.add.text(game.config.width/2, game.config.height, 'LEFT / RIGHT to Navigate, SPACE for Menu', textConfig).setOrigin(0.5,1);

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.page = 1;
        this.maxPage = 5;
        // Jump, Duck, Shield, Jump on Car, Jump on Meteor

        // creating each controls page
        this.playerPage1 = this.add.sprite(game.config.width/2 - 100, game.config.height/2 + 30, 'player_atlas', 'run_0001').setScale(this.PLAYER_SCALE).setOrigin(0.5);
        this.carPage1 = this.add.sprite(game.config.width/2 + 100, game.config.height/2 + 95, 'car').setScale(this.CAR_SCALE).setOrigin(0.5);
        this.meteorPage1 = this.add.sprite(game.config.width/2, game.config.height/2 + 80, 'meteor').setScale(this.METEOR_SCALE).setOrigin(0.5);
        
        this.playerPage2 = this.add.sprite(game.config.width/2 - 100, game.config.height/2 + 100, 'player_atlas', 'duck_0001').setScale(this.DUCK_SCALE).setOrigin(0.5);
        // this.playerPage2.angle = 90;
        this.meteorPage2 = this.add.sprite(game.config.width/2 + 100, game.config.height/2 + 40, 'meteor').setScale(this.METEOR_SCALE).setOrigin(0.5);

        this.shieldPage3 = this.add.sprite(game.config.width/2, game.config.height/2 + 40, 'shield').setScale(this.SHIELD_SCALE).setOrigin(0.5);

        this.playerPage4 = this.add.sprite(game.config.width/2 + 20, game.config.height/2 + 22, 'player_atlas', 'run_0002').setScale(this.PLAYER_SCALE).setOrigin(0.5);
        this.carPage4 = this.add.sprite(game.config.width/2, game.config.height/2 + 95, 'car').setScale(this.CAR_SCALE).setOrigin(0.5);

        this.meteorPage5 = this.add.sprite(game.config.width/2+50, game.config.height/2 + 60, 'meteor').setScale(this.METEOR_SCALE).setOrigin(0.5);
        this.playerPage5 = this.add.sprite(game.config.width/2, game.config.height/2 + 10, 'player_atlas', 'run_0006').setScale(this.PLAYER_SCALE).setOrigin(0.5);

        this.physics.add.sprite(game.config.width/4, game.config.height - 4*tileSize,  'floor').setScale(SCALE).setOrigin(0);

        this.wind = this.sound.add('wind');
        this.wind.play();

        this.time.addEvent({ delay: 6000, callback: () => {
            this.wind.play();
        }, callbackScope: this, loop: true });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sfx_select.play();
            this.wind.stop();
            this.scene.start('menuScene'); 
            this.scene.start('menuScene');    
        }

        this.pageNum.text = 'Page ' + this.page + ' / ' + this.maxPage;
        this.pageNumShadow.text = 'Page ' + this.page + ' / ' + this.maxPage;

        this.playerPage1.alpha = 0;
        this.carPage1.alpha = 0;
        this.meteorPage1.alpha = 0;
        this.playerPage2.alpha = 0;
        this.meteorPage2.alpha = 0;
        this.shieldPage3.alpha = 0;
        this.playerPage4.alpha = 0;
        this.carPage4.alpha = 0;
        this.playerPage5.alpha = 0;
        this.meteorPage5.alpha = 0;

        switch (this.page) {
            case 1:
                this.controlsText.text = 'Use SPACE to jump.';
                this.controlsTextShadow.text = 'Use SPACE to jump.';
                this.playerPage1.alpha = 1;
                this.carPage1.alpha = 1;
                this.meteorPage1.alpha = 1;
                break;
            case 2:
                this.controlsText.text = 'Use DOWN to duck.';
                this.controlsTextShadow.text = 'Use DOWN to duck.';
                this.playerPage2.alpha = 1;
                this.meteorPage2.alpha = 1;
                break;
            case 3:
                this.controlsText.text = 'Shields protect against one hit.';
                this.controlsTextShadow.text = 'Shields protect against one hit.';
                this.shieldPage3.alpha = 1;
                break;
            case 4:
                this.controlsText.text = 'Cars can be jumped on, but don\'t stay\non them for too long.';
                this.controlsTextShadow.text = 'Cars can be jumped on, but don\'t stay\non them for too long.';
                this.playerPage4.alpha = 1;
                this.carPage4.alpha = 1;
                break;
            case 5:
                this.controlsText.text = 'Jumping on Meteors causes damage.';
                this.controlsTextShadow.text = 'Jumping on Meteors causes damage.';
                this.playerPage5.alpha = 1;
                this.meteorPage5.alpha = 1;
                break;
        }

        if (Phaser.Input.Keyboard.JustDown(keyLEFT) && this.page > 1) {
            this.sfx_select.play();
            this.page --;
        }
        else if (Phaser.Input.Keyboard.JustDown(keyRIGHT) && this.page < this.maxPage) {
            this.sfx_select.play();
            this.page ++;
        }

    }
}