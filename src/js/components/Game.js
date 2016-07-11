import Circle from './Circle.js';
import Interface from './Interface.js';
import Bullets from './Bullets.js';

/* *
* @class Game class with main loop
*/
export default class Game {
	/* *
	* @constructor
	*/
	constructor(level) {
		this.level = level;
		this.levelOptions = /* this.level.circle.options || */{
			name: '1',
			colorSlice: [45, 45, 90, 150, 30],
			colors: ['#26C6DA', '#D4E157', '#FF7043', '#7E57C2', '#B2DFDB'],
			circleSpeed: 1,
			bulletSpeed: 1,
		};

		this.userInterface = new Interface();
		this.circle = new Circle(this.levelOptions);
		this.bullets = new Bullets(this.levelOptions);
		this._lastTime = 0;
		this.fire = false;
	}

	/**
	 * Инициализируем запуск игрового процесса
	 */
	initGame() {
		this.render();
		this.userInterface.gameScreen.addEventListener('click', this._fire.bind(this));
		setInterval(this.gameLoop.bind(this), 50);
	}

	// Прорисовка игровых компонентов
	render() {
		this.circle.renderSlices();
		this.bullets.renderBullets();
	}

	/**
	 * Запуск пули по клику
	 *
	 * @param  {event} bullet fire event
	 * @returns {boolean}
	 */
	_fire(event) {
		event.preventDefault();

		if (event.target.dataset.action !== 'pause') {
			this.fire = true;
		}
	}

	// Основной игровой цикл
	gameLoop() {
		const time = Date.now();
		const delta = time - this._lastTime; // сколько прошло с последнего обновления;
		this._lastTime = time; // сохраним на следующий вызов текущее время;
		this.circle.update(delta); // провернем круг исходя из прошедшего с последнего поворота времени
		// console.log(this.circle.hitSectorColor);
		if (this.fire) {
			this.bullets.update(delta); // "продвинем» пулю, если она есть на  нужное расстояние.
			if (this.bullets.hit) {
				// Пуля долетела до круга
				console.log('hit!');
			}
		}
	}
}
