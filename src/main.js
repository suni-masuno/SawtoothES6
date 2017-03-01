import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'

import config from './config'

// Redux
import {createStore, dispatch} from 'Redux'
//const { createStore, dispatch } = Redux;

// Actions
const CLICK = 'CLICK';
function click() {
	return {
		type: CLICK
	};
}


// Reducers
function coordinates(state = [1, 1], action) {
	switch(action.type) {
		case CLICK:
			return [
				state[0] + 40 * Math.random(),
				state[1] + 40 * Math.random()
			]
		default:
			return state;
	}
}

// Store
let store = createStore(coordinates);

// Subscribers
function movePlane(plane) {
	game.add.tween(plane).to({x: store.getState()[0], y: store.getState()[1] }, 1000, 'Linear', true);
}


// Game
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {
	game.load.image('backdrop', 'https://raw.githubusercontent.com/Josh-Miller/public-images/master/clouds.png');
	game.load.image('plane', 'https://raw.githubusercontent.com/Josh-Miller/public-images/master/plane.png');
}

function create() {
	game.stage.backgroundColor = "#DEEFF5";
	game.add.sprite(0, 0, 'backdrop');
	const plane = game.add.sprite(store.getState()[0], store.getState()[1], 'plane');
	plane.inputEnabled = true;
	plane.collideWorldBounds = true;

	// Subscribe function to store changes
	store.subscribe(movePlane.bind(null, plane));

	// When you click the plane, fire our click action
	plane.events.onInputDown.add(() => {store.dispatch(click())}, null);

}
/*class Game extends Phaser.Game {

  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)

    this.state.start('Boot')
  }
}

window.game = new Game()*/
