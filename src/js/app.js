import Game from './components/Game.js';
import viewportUnitsBuggyfill from 'viewport-units-buggyfill';
import 'add-to-homescreen/addtohomescreen.js';
import 'add-to-homescreen/dist/style/addtohomescreen.css';

window.addToHomescreen();

if (window.navigator.userAgent.match(/iPad/i) || window.navigator.userAgent.match(/iPhone/i)) {
	viewportUnitsBuggyfill.init();
}

const game = new Game();
window.addEventListener('hashchange', game.checkLocation.bind(game));
window.addEventListener('resize', game.getGameMetrics.bind(game));
document.body.addEventListener('click', game.initClickEvents.bind(game));
document.body.addEventListener('touchend', game.initClickEvents.bind(game));
document.body.addEventListener('keydown', game.initKeyboardEvents.bind(game));
