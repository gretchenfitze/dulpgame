import Circle from './Circle.js';
import Interface from './Interface.js';

/* *
* @class Game class with main loop
*/
export default class Game {
	/* *
	* @constructor
	*/
	constructor(level) {
		this.level = level;
		this.circleOptions = /* this.level.circle.options || */{
			name: '1',
			colorCount: 5,
			colorSlice: [45, 45, 90, 150, 30],
			colors: ['#26C6DA', '#D4E157', '#FF7043', '#7E57C2', '#B2DFDB'],
			circleSpeed: 1,
			bulletSpeed: 1,
		};

		this.userInterface = new Interface();
		this.circle = new Circle(this.circleOptions);
		this._lastTime = 0;
	}

	/**
	 * Инициализируем запуск игрового процесса
	 */
	initGame() {
		this.render();
		this.userInterface.showGameScreen();
		setInterval(this.gameLoop.bind(this), 50);
	}

	/**
	 * Прорисовка игровых компонентов
	 */
	render() {
		this.circle.renderSlices();
	}

	/**
	 * Основной игровой цикл
	 */
	gameLoop() {
		const time = Date.now();
		const delta = time - this._lastTime; // сколько прошло с последнего обновления;
		this._lastTime = time; // сохраним на следующий вызов текущее время;
		this.circle.update(delta); // провернем круг исходя из прошедшего с последнего поворота времени
		if (this._activeBullet) {
			this.activeBullet.update(delta); // "продвинем» пулю, если она есть на  нужное расстояние.

			this.checkIntersection(); // проверим, а не долетела ли пуля до круга
		}
	}

	/**
	 * Проверка если пуля долетела до круга
	 * @returns {boolean}
	 */
	checkIntersection() {
		return false; // заглушка, пока нет пули
	}
}
