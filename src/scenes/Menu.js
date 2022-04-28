class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }

    preload() {
        this.load.image('city', './assets/bg.png');
    }
    create() {
        let menuConfig = {
            fontFamily: 'Alagard',
            fontSize: '90px',
            color: '#000000',
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

        this.add.text(game.config.width/2 + 4, game.config.height/4 + 4, 'RunPocalypse', dropshadow).setOrigin(0.5);
        dropshadow.fontSize = '40px';
        this.add.text(game.config.width/2 + 2, game.config.height/1.5 + 2, 'Press SPACE to start', dropshadow).setOrigin(0.5);

        this.add.text(game.config.width/2, game.config.height/4, 'RunPocalypse', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '40px';
        this.add.text(game.config.width/2, game.config.height/1.5, 'Press SPACE to start', menuConfig).setOrigin(0.5);

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('playScene');    
          }

    }
}