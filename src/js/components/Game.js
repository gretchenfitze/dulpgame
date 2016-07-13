import Circle from './Circle.js';
import Interface from './Interface.js';
import Bullets from './Bullets.js';

/**
 * @class Game class with main loop
 */
export default class Game {
	/**
	 * @constructor
	 */
	constructor(level) {
		this.level = level;
		this.levelOptions = {
			name: '1',
			colorSlice: [45, 45, 90, 150, 30],
			colors: ['#26C6DA', '#D4E157', '#FF7043', '#7E57C2', '#B2DFDB'],
			circleSpeed: 2,
			bulletSpeed: 2,
		};

		this.interface = new Interface();
		this.circle = new Circle(this.levelOptions);
		this.bullets = new Bullets(this.levelOptions);
	}

	/**
	 * Запуск игрового процесса
	 *
	 * @private
	 */
	_initNewGame() {
		this._render();
		this._isPaused = false;
		this._lastTime = 0;
		this._fire = false;
		this.bullets.hit = false;
		this.interface.showGameScreen();
		this._gameLoopInterval = setInterval(this._gameLoop.bind(this), 50);
		// TODO: Удаление данных о всех пройденных уровнях
	}

	/**
	 * Прорисовка игровых компонентов
	 *
	 * @private
	 */
	_render() {
		this.circle.renderSlices();
		this.bullets.renderBullets();
	}

	/**
	 * Сброс данных уровня при выходе или конце игры
	 *
	 * @private
	 */
	_resetLevel() {
		clearInterval(this._gameLoopInterval);
		this.bullets.bulletPath = 0;
		this.bullets.activeBullet.remove();
		this.circle.el.innerHTML = '';
		this.bullets.el.innerHTML = '';
	}

	/**
	 * Проверка правильности попадания и продолжение игры с новой пулей или экран проигрыша
	 *
	 * @private
	 */
	_onHit() {
		if (this.circle.hitSectorColor === this.bullets.activeBullet.color) {
			this._fire = false;
			this.circle.deleteHitSector();
			this._levelPassed();
			this.bullets.reset();
		} else {
			console.log('YOU LOSE!');
			this._resetLevel();
			this.interface.showStartScreen();
			// TODO: Показываем экран проигрыша
		}
	}

	/**
	 * Основной игровой цикл
	 *
	 * @private
	 */
	_gameLoop() {
		const time = Date.now();
		const delta = time - this._lastTime; // время с последнего обновления
		this._lastTime = time; // на следующий вызов сохраняется текущее время
		if (!this._isPaused) {
			this.circle.update(delta);// круг поворачивается исходя из прошедшего времени
			if (this._fire) { // произошло событие выстрела
				this.bullets.update(delta); // пуля летит
				if (this.bullets.hit) { // когда координаты пули поравнялись с кругом
					this._onHit(); // правильный сектор удаляется либо показывается экран конца игры
				}
			}
		}
	}

	/**
	 * Проверка, пройден ли уровень
	 *
	 * @private
	 */
	_levelPassed() {
		if (!this.circle.el.children.length) {
			console.log('YOU WIN!');
			this._resetLevel();
			this.interface.showStartScreen();
			// TODO: Показываем экран выигрыша и перехода на следующий уровень
		}
	}

	/**
	* Обработка клика для запуска пули
	*
	* @param  {event} bullet fire event
	* @returns {boolean}
	*/
	fire(event) {
		event.preventDefault();
		if (event.target.dataset.action !== 'pause') {
			this._fire = true;
		}
	}

	/**
	 * Обработка событий клика по кнопкам меню
	 *
	 * @param	{Event} click event
	 */
	onClick(event) {
		event.preventDefault();

		switch (event.target.dataset.action) {
		case 'newgame':
			this._initNewGame();
			break;
		case 'continue':
			// TODO: Загрузка из кукис данных о последнем законченном уровне
			this._isPaused = false;
			this.interface.showGameScreen();
			break;
		case 'pause':
			this._isPaused = true;
			this.interface.showPauseScreen();
			break;
		case 'exit':
			// TODO: Удаление данных уровня, сохранение в кукис данных о последнем законченном уровне
			this._resetLevel();
			this.interface.showStartScreen();
			break;
		default:
			break;
		}
	}
}
