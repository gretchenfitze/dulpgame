import './../public/style/_normalize.css';
import './../public/style/app.css';
import Game from './../src/js/components/Game.js';

const game = new Game();
window.addEventListener('hashchange', game.checkLocation.bind(game));
window.addEventListener('resize', game.getGameMetrics.bind(game));
document.body.addEventListener('click', game.initClickEvents.bind(game));
document.body.addEventListener('touchend', game.initClickEvents.bind(game));
document.body.addEventListener('keydown', game.initKeyboardEvents.bind(game));
