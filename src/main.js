

// tame the javashrek
'use strict';

// global variables
let keyLeft;
let keySPACE;
let keyDOWN;
let highScore = 0;
let currentScene = 0;
const SCALE = 0.5;
const tileSize = 35;

// main game object
let config = {
    type: Phaser.WEBGL,
    width: 840,
    height: 525,
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
    scene: [Menu, Play, Credits]
};

let game = new Phaser.Game(config);


