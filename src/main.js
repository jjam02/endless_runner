// tame the javashrek
'use strict';

// global variables
let keySPACE;
let keyDOWN;
let keyLEFT;
let keyRIGHT;
let highScore = 0;
let currentScene = 0;
let menuMusic = 0;
let isPlayerMenu = false;
const SCALE = 0.5;
const tileSize = 35;

// main game object
let config = {
    type: Phaser.WEBGL,
    width: 840,
    height: 525,
    autoCenter: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu, Play, Credits, Controls]
};

let game = new Phaser.Game(config);