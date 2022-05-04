class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }

    preload() {
        this.load.image('city', './assets/bg.png');
        this.load.audio('hit', './assets/hit.wav');
        this.load.audio('jump', './assets/jump.wav');
        this.load.audio('shield', './assets/shield.wav');
        this.load.audio('select', './assets/select.wav');
        this.load.audio('duck', './assets/duck.wav');
        this.load.audio('slide', './assets/sliding.wav');
        this.load.audio('music', './assets/among_drip.wav');
        this.load.audio('off', './assets/shield_hit.wav');
    }
    create() {
        let menuConfig = {
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
            color: '#505050',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.cityscape = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'city').setOrigin(0);

        dropshadow.color = '#221A49';
        this.add.text(game.config.width/2 + 4, game.config.height/4 + 4, 'RunPocalypse', dropshadow).setOrigin(0.5);
        dropshadow.fontSize = '40px';
        dropshadow.color = '#505050';
        this.add.text(game.config.width/2 + 2, game.config.height/1.5 + 2, 'Press SPACE to start', dropshadow).setOrigin(0.5);
        this.add.text(game.config.width/2 + 2, game.config.height/1.3 + 2, 'Press DOWN for Credits', dropshadow).setOrigin(0.5);

        this.add.text(game.config.width/2, game.config.height/4, 'RunPocalypse', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '40px';
        menuConfig.color = '#000000';
        this.add.text(game.config.width/2, game.config.height/1.5, 'Press SPACE to start', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.3, 'Press DOWN for Credits', menuConfig).setOrigin(0.5);

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('select');
            this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.sound.play('select');
            this.scene.start('creditsScene');
        }

    }
}