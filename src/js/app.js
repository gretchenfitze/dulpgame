import '../css/main.css';

import Game from './components/Game.js';

const game = new Game();

const startButton = document.querySelector('.btn__start');

startButton.addEventListener('click', game.initGame.bind(game));
