import Game from './components/Game.js';

const xhr = new XMLHttpRequest();
xhr.open('GET', '/levels.json', true);
xhr.send();

xhr.onreadystatechange = () => {
	if (xhr.readyState !== 4) return; // TODO: страница загрузки
	if (xhr.status === 200) {
		const game = new Game();
		game.levels = JSON.parse(xhr.responseText);
		game.checkLocation();
		document.body.addEventListener('click', game.onClick.bind(game));
		game.interface.gameScreen.addEventListener('click', game.fire.bind(game));
		// document.body.addEventListener('popstate', );
	} else {
		console.log(`${xhr.status}: ${xhr.statusText}`); // TODO: страница ошибки
	}
};
