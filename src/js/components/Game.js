import Circle from './Circle.js';
import Interface from './Interface.js';
import Bullets from './Bullets.js';
import Utilities from './Utilities.js';
import RandomLevel from './RandomLevel.js';
import levels from '../../data/levels.json';

/**
 * @class Game class with main loop
 */
export default class Game {
	/**
	 * @constructor
	 */
	constructor() {
		this.utils = new Utilities();
		this.interface = new Interface();
		this.gameColors = [
			'#001f3f',
			'#0074D9',
			'#7FDBFF',
			'#39CCCC',
			'#3D9970',
			'#01FF70',
			'#FFDC00',
			'#FF851B',
			'#FF4136',
			'#F012BE',
			'#B10DC9'];
		this.numberOfPresetedLevels = Object.keys(levels).length;
		this.checkLocation();
		this.interface.gameScreen.addEventListener('mousedown', this._fire.bind(this));
		this.interface.gameScreen.addEventListener('touchstart', this._fire.bind(this));
		this._onHit = this._onHit.bind(this);
	}

	/**
	 * Запуск игрового процесса
	 *
	 * @param {Number} Level number
	 * @private
	 */
	_initNewGame(levelNumber) {
		this._resetLevel();
		if (levelNumber === 'random') {
			this._initRandomLevel();
		} else {
			this.level = levels[levelNumber];
		}
		const _colors = this._shuffleColors(this.gameColors, this.level.colorSlice.length);
		this.circle = new Circle(this.level, _colors);
		this.bullets = new Bullets(this.level, _colors);
		this.utils.changeUrl(`#level/${levelNumber}`);
		this.interface.showScreen(this.interface.gameScreen);
		this.metricTimeout = setTimeout(this.getGameMetrics.bind(this),
			this.interface.interfaceTimeout * 2);
	}

	/**
	 * Формирование случайного уровня
	 *
	 * @private
	 */
	_initRandomLevel() {
		const _randomLevel = new RandomLevel();
		this.level = {
			name: '∞',
			colorSlice: _randomLevel.colorSlice,
			circleSpeed: _randomLevel.speed,
			bulletSpeed: Math.abs(_randomLevel.speed),
			size: _randomLevel.size,
			reverse: _randomLevel.reverse,
		};
	}

	/**
	 * Выбор случайных цветов из массива для уровня
	 *
	 * @param	{Array} colors used in the game
	 * @param	{Number} number of circle slices for level
	 * @private
	 * @return {Array} colors for level
	 */
	_shuffleColors(gameColors, count) {
		let colors = gameColors.slice(0);
		if (this.level.colorSlice.length > colors.length) {
			colors = colors.concat(colors);
		}
		let i = colors.length;
		const min = i - count;
		while (i-- > min) {
			const index = Math.floor((i + 1) * Math.random());
			const temp = colors[index];
			colors[index] = colors[i];
			colors[i] = temp;
		}
		colors = colors.slice(min);
		return colors;
	}

	/**
	 * Сброс данных уровня при выходе или конце игры
	 *
	 * @private
	 */
	_resetLevel() {
		this.interface.gameScreen.classList.remove('blur');
		const _lostBalls = document.querySelectorAll('.game-screen__bullet');
		if (_lostBalls) {
			[].forEach.call(_lostBalls, (ball) => {
				ball.remove();
			});
		}
		if (this.bullets) {
			this.bullets.el.innerHTML = '';
			this.bullets = null;
		}
		if (this.circle) {
			this.circle.el.innerHTML = '';
			this.circle = null;
		}
		this._isFired = false;
	}

	/**
	 * Проверка правильности попадания и продолжение игры с новой пулей или экран проигрыша
	 *
	 * @private
	 */
	_onHit() {
		this.bullets.activeBullet.removeEventListener('transitionend', this._onHit);
		const _hitSectorColor = this.circle.getHitSectorColor();
		if (_hitSectorColor === this.bullets.activeBulletColor) {
			this.bullets.rebound();
			this.circle.deleteHitSector();
			this._isLevelPassed();
			if (this.bullets) {
				this.bullets.reset();
			}
			this._isFired = false;
		} else {
			this.circle.stopAnimation();
			if (!_hitSectorColor) {
				this.bullets.fireToTheCircleCenter();
			}
			this.interface.showScreen(this.interface.loseScreen);
		}
	}

	/**
	 * Проверка, пройден ли уровень
	 *
	 * @private
	 */
	_isLevelPassed() {
		if (!this.circle.el.children.length) {
			let levelNumber = this.utils.getLevelFromStorage();
			this.interface.showWinScreen();
			if (levelNumber >= this.numberOfPresetedLevels) {
				this.interface.showCongratulations();
				levelNumber = 'random';
				localStorage.setItem('levelNumber', 'random');
			} else if (levelNumber !== 'random') {
				levelNumber++;
				localStorage.setItem('levelNumber', levelNumber);
			}
		}
	}

	/**
	* Обработка клика для запуска пули
	*
	* @param	{Event} bullet fire event
	* @private
	* @return {Boolean}
	*/
	_fire(event) {
		event.preventDefault();
		if ((event.target.dataset.action !== 'pause') && (!this._isFired)) {
			this._isFired = true;
			this.bullets.fire();
			this.bullets.activeBullet.addEventListener('transitionend', this._onHit);
		}
	}

	/**
	 * Обработка событий клика по кнопкам меню
	 *
	 * @param	{Event} click event
	 */
	initClickEvents(event) {
		event.preventDefault();
		let _levelNumber = this.utils.getLevelFromStorage();

		switch (event.target.dataset.action) {
		case 'newgame':
			localStorage.clear();
			this._initNewGame(1);
			break;
		case 'continue':
			this._initNewGame(_levelNumber);
			break;
		case 'choose':
			this.interface.renderLevelsScreen(this.numberOfPresetedLevels);
			break;
		case 'continue-chosen':
			_levelNumber = event.target.textContent !== '∞' ? event.target.textContent : 'random';
			localStorage.setItem('levelNumber', _levelNumber);
			this._initNewGame(_levelNumber);
			break;
		case 'pause':
			this._pauseGame();
			break;
		case 'continue-pause':
			this.interface.showScreen(this.interface.gameScreen);
			break;
		case 'exit':
			this.interface.exitToMainMenu();
			break;
		default:
			break;
		}
	}

	/**
	* Пауза игры
	*
	* @private
	*/
	_pauseGame() {
		if (!this._isFired) {
			this.interface.showScreen(this.interface.pauseScreen);
		}
	}

	/**
	 * Запуск уровня, соответствующего URL в адресной строке
	 * Если уровень ещё не открыт - редирект на главную страницу
	 *
	 * @private
	 */
	checkLocation() {
		const _levelHash = location.hash.split('/')[1];
		if ((location.hash.indexOf('level/') > -1) &&
		(_levelHash <= this.utils.getLevelFromStorage())) {
			this._initNewGame(_levelHash);
		} else {
			this.interface.exitToMainMenu();
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
				this._pauseGame();
				break;
			case 32:
				this._fire(event);
				break;
			default:
				break;
			}
		}
	}

	// Подсчет переменных, зависящих от размера экрана
	getGameMetrics() {
		if (!this.interface.gameScreen.classList.contains('invisible')) {
			this.circle.getCircleMetrics();
			this.bullets.getBulletsMetrics();
			clearTimeout(this.metricTimeout);
		}
	}
}
