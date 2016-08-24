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
	constructor() {
		this.interface = new Interface();
		this._stepInterval = 1000 / 30;
		this.gameColors = [
			'#001f3f',
			'#0074D9',
			'#7FDBFF',
			'#39CCCC',
			'#3D9970',
			'#2ECC40',
			'#01FF70',
			'#FFDC00',
			'#FF851B',
			'#FF4136',
			'#F012BE',
			'#B10DC9'];
	}

	/**
	 * Запуск игрового процесса
	 *
	 * @param {Number} Level number
	 * @private
	 */
	_initNewGame(level) {
		this._resetLevel();
		if ((!this.levelNumber) || (this.levelNumber <= Object.keys(this.levels).length)) {
			this.level = this.levels[level];
		} else {
			this._initRandomLevel();
		}
		this._shuffleColors(this.gameColors, this.level.colorSlice.length);
		this.circle = new Circle(this.level, this.colors);
		this.bullets = new Bullets(this.level, this.colors);
		this._render();
		this._isPaused = false;
		this._fire = false;
		this.bullets.hit = false;
		this._changeUrl(`#level/${this.levelNumber}`);
		this.interface.showGameScreen();
		this._gameLoopInterval = setInterval(this._gameLoop.bind(this), this._stepInterval);
	}

	/**
	 * Формирование случайного уровня
	 *
	 * @private
	 */
	_initRandomLevel() {
		this.minSlice = 15;
		this.maxSlice = 150;
		this.maxNumberOfSlices = 12;
		this.levelNumber = '∞';
		this.colorSliceRandom = [];
		this.sumOfSlices = 0;
		this._addRandomSlice();
		while (this._sumOfSlices() <= 360) {
			this._addRandomSlice();
		}
		this.colorSliceRandom.splice(-1, 1, this._lastSlice() - this._sumOfSlices() + 360);
		if (this._lastSlice() < this.minSlice) {
			this.colorSliceRandom.splice(-2, 2);
			this.colorSliceRandom.push(360 - this._sumOfSlices());
		}

		if (this.colorSliceRandom.length > this.maxNumberOfSlices) {
			this.colorSliceRandom.splice(this.maxNumberOfSlices - 1,
				this.colorSliceRandom.length - this.maxNumberOfSlices + 1);
			this.colorSliceRandom.push(360 - this._sumOfSlices());
		}

		this.minSpeed = 0.5;
		this.maxSpeed = 5;
		this.minSize = 20;
		this.maxSize = 50;

		this.speedRandom = this.minSpeed + Math.random() * (this.maxSpeed - this.minSpeed);
		this.sizeRandom = this.minSize + Math.random() * (this.maxSize - this.minSize);
		this.reverseRandom = Math.random() < 0.5;
		this.level = {
			name: '∞',
			colorSlice: this.colorSliceRandom,
			circleSpeed: this.speedRandom,
			bulletSpeed: this.speedRandom,
			size: this.sizeRandom,
			reverse: this.reverseRandom,
		};
	}

	/**
	 * Добавление сектора для случайных уровней
	 *
	 * @private
	 * @return {Number}
	 */
	_addRandomSlice() {
		this.colorSliceRandom.push(this.minSlice + Math.random() * (this.maxSlice - this.minSlice));
	}

	/**
	 * Определение размера последнего сектора для случайных уровней
	 *
	 * @private
	 * @return {Number}
	 */
	_lastSlice() {
		return this.colorSliceRandom[this.colorSliceRandom.length - 1];
	}

	/**
	 * Подсчет суммы секторов для случайных уровней
	 *
	 * @private
	 * @return {Number}
	 */
	_sumOfSlices() {
		return this.colorSliceRandom.reduce((slice1, slice2) => slice1 + slice2);
	}

	/**
	 * Выбор случайных цветов из массива для уровня
	 *
	 * @param	{Array} colors used in the game
	 * @param	{Number} number of circle slices for level
	 */
	_shuffleColors(gameColors, count) {
		this.colors = gameColors.slice(0);
		if (this.level.colorSlice.length > this.colors.length) {
			this.colors = this.colors.concat(this.colors);
		}
		let i = this.colors.length;
		const min = i - count;
		while (i-- > min) {
			const index = Math.floor((i + 1) * Math.random());
			const temp = this.colors[index];
			this.colors[index] = this.colors[i];
			this.colors[i] = temp;
		}
		this.colors = this.colors.slice(min);
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
		if (this.bullets) {
			if (this.bullets.boundingBullet) {
				this.bullets.boundingBullet.removeEventListener('transitionend', this.bullets.removeBullet);
			}
			this.activeBall = this.bullets.el.parentNode.querySelector('.bullet--active');
			if (this.activeBall) {
				this.activeBall.remove();
			}
			this.circle.el.innerHTML = '';
			this.bullets.el.innerHTML = '';
			this.circle = null;
			this.bullets = null;
		}
	}

	/**
	 * Проверка правильности попадания и продолжение игры с новой пулей или экран проигрыша
	 *
	 * @private
	 */
	_onHit() {
		this.bullets.rebound();
		this.circle.getHitSector();
		if (this.circle.hitSectorColor === this.bullets.activeBulletColor) {
			this._fire = false;
			this.circle.deleteHitSector();
			this._levelPassed();
			if (this.bullets) {
				this.bullets.reset();
			}
		} else {
			this._resetLevel();
			this.interface.showLoseScreen();
			this._changeUrl(`#level/${this.levelNumber}/lose`);
		}
	}

	/**
	 * Основной игровой цикл
	 *
	 * @private
	 */
	_gameLoop() {
		if (!this._isPaused) {
			this.circle.update();
			if (this._fire) {
				this.bullets.update();
				if (this.bullets.hit) {
					this._onHit();
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
			this._changeUrl(`#level/${this.levelNumber}/win`);
			this._resetLevel();
			this.interface.showWinScreen();
		}
	}

	/**
	* Обработка клика для запуска пули
	*
	* @param	{Event} bullet fire event
	* @return {Boolean}
	*/
	fire(event) {
		event.preventDefault();
		if (event.target.dataset.action !== 'pause') {
			this._fire = true;
		}
	}

	/**
	 * Смена состояния адресной строки
	 *
	 * @param {String} href
	 * @private
	 */
	_changeUrl(href) {
		history.replaceState(null, null, href);
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
			localStorage.removeItem('levelNumber');
			this.levelNumber = 1;
			this._initNewGame(this.levelNumber);
			break;
		case 'continue':
			this.levelNumber = localStorage.getItem('levelNumber');
			this._initNewGame(this.levelNumber);
			this._isPaused = false;
			this.interface.showGameScreen();
			break;
		case 'pause':
			this._isPaused = true;
			this._changeUrl(`#level/${this.levelNumber}/paused`);
			this.interface.showPauseScreen();
			break;
		case 'continue-pause':
			this._isPaused = false;
			this._changeUrl(`#level/${this.levelNumber}`);
			this.interface.showGameScreen();
			break;
		case 'exit-win':
			localStorage.setItem('levelNumber', this.levelNumber + 1);
			this._resetLevel();
			this.interface.showStartScreen();
			this.interface.isContinuable();
			break;
		case 'exit':
			this._resetLevel();
			this.interface.showStartScreen();
			this.interface.isContinuable();
			break;
		case 'nextlevel':
			if (this.levelNumber !== '∞') {
				this.levelNumber++;
				localStorage.setItem('levelNumber', this.levelNumber);
			}
			this._initNewGame(this.levelNumber);
			this.interface.showGameScreen();
			break;
		case 'tryagain':
			this._initNewGame(this.levelNumber);
			this.interface.showGameScreen();
			break;
		default:
			break;
		}
	}

	/**
	 * Запуск уровня, соответствующего URL в адресной строке
	 * Если уровень ещё не открыт - редирект на главную страницу
	 */
	checkLocation() {
		this.levelHash = location.hash.split('/')[1];
		if ((location.hash.indexOf('#level/') > -1) &&
		((localStorage.getItem('levelNumber')) &&
		(this.levelHash <= localStorage.getItem('levelNumber')) ||
		(+this.levelHash === 1))) {
			this.levelNumber = this.levelHash;
			this._initNewGame(this.levelNumber);
			this._isPaused = true;
			this._changeUrl(`#level/${this.levelNumber}/paused`);
			this.interface.showPauseScreen();
		} else {
			this._resetLevel();
			this.interface.showStartScreen();
			this.interface.isContinuable();
		}
	}

	/**
	 * Обработка событий для пробела (пуск пули) и Esc (пауза)
	 *
	 * @param  {Event} keyboard event
	 */
	initKeyboardEvents(event) {
		if (!this.interface.gameScreen.classList.contains('invisible')) {
			switch (event.keyCode) {
			case 27:
				this._isPaused = true;
				this._changeUrl(`#level/${this.levelNumber}/paused`);
				this.interface.showPauseScreen();
				break;
			case 32:
				this._fire = true;
				break;
			default:
				break;
			}
		}
	}

	// Обработка события обновления данных в кэше мобильного веб-приложения
	updateSite() {
		window.applicationCache.swapCache();
	}
}
