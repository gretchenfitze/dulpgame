import Game from './components/Game.js';
import viewportUnitsBuggyfill from 'viewport-units-buggyfill';
import './../css/addtohomescreen.css';
import levels from './../data/levels.json';

if (window.navigator.userAgent.match(/iPad/i) || window.navigator.userAgent.match(/iPhone/i)) {
	viewportUnitsBuggyfill.init();
}

const game = new Game();
game.levels = levels;
game.checkLocation();
window.addEventListener('hashchange', game.checkLocation.bind(game));

document.body.addEventListener('mouseup', game.onClick.bind(game));
document.body.addEventListener('touchend', game.onClick.bind(game));
document.body.addEventListener('keydown', game.initKeyboardEvents.bind(game));
game.interface.gameScreen.addEventListener('mousedown', game.fire.bind(game));
game.interface.gameScreen.addEventListener('touchstart', game.fire.bind(game));
