import '../css/main.css';

import Game from './components/Game.js';

const game = new Game();

document.body.addEventListener('click', game.onClick.bind(game));
game.interface.gameScreen.addEventListener('click', game.fire.bind(game));
