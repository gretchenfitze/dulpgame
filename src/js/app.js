import Game from './components/Game.js';
import viewportUnitsBuggyfill from 'viewport-units-buggyfill';
import fastclick from 'fastclick';
import './../css/addtohomescreen.css';

if (window.navigator.userAgent.match(/iPad/i) || window.navigator.userAgent.match(/iPhone/i)) {
	viewportUnitsBuggyfill.init();
	fastclick.attach(document.body);
}

const xhr = new XMLHttpRequest();
xhr.open('GET', '/data/levels.json', true);
xhr.send();

xhr.onreadystatechange = () => {
	if (xhr.readyState !== 4) return;
	if (xhr.status === 200) {
		const game = new Game();
		game.levels = JSON.parse(xhr.responseText);
		game.checkLocation();
		window.addEventListener('hashchange', game.checkLocation.bind(game));
		document.body.addEventListener('click', game.onClick.bind(game));
		game.interface.gameScreen.addEventListener('mousedown', game.fire.bind(game));
		document.body.addEventListener('keydown', game.initKeyboardEvents.bind(game));
	} else {
		console.log(`${xhr.status}: ${xhr.statusText}`); // TODO: страница ошибки
	}
};
