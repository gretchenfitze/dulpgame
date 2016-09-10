import Circle from './Circle.js';
import Interface from './Interface.js';
import Bullets from './Bullets.js';
import Utilities from './Utilities.js';
import Random from './Random.js';
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
		this.levels = levels;
		this.numberOfPresetedLevels = Object.keys(this.levels).length;
		this.checkLocation();
		this.interface.gameScreen.addEventListener('mousedown', this._fire.bind(this));
		this.interface.gameScreen.addEventListener('touchstart', this._fire.bind(this));
		this.clickable = true;
	}

	/**
	 * Запуск игрового процесса
	 *
	 * @param {Number} Level number
	 * @private
	 */
	_initNewGame(level) {
		this._resetLevel();
		if ((!this.levelNumber) || (this.levelNumber <= this.numberOfPresetedLevels)) {
			this.level = this.levels[level];
		} else {
			this.random = new Random();
			this._initRandomLevel();
		}
		this._shuffleColors(this.gameColors, this.level.colorSlice.length);
		this.circle = new Circle(this.level, this.colors);
		this.bullets = new Bullets(this.level, this.colors);
		this._isPaused = false;
		this.utils.changeUrl(`#level/${this.levelNumber}`);
		this.interface.showGameScreen();
		this.circle.continueAnimation();
		this.getGameMetrics();
	}

	/**
	 * Формирование случайного уровня
	 *
	 * @private
	 */
	_initRandomLevel() {
		this._resetLevel();
		this.levelNumber = '∞';
		this.random.createRandomLevel();
		this.level = {
			name: '∞',
			colorSlice: this.random.colorSliceRandom,
			circleSpeed: this.random.speedRandom,
			bulletSpeed: Math.abs(this.random.speedRandom),
			size: this.random.sizeRandom,
			reverse: this.random.reverseRandom,
		};
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
	 * Сброс данных уровня при выходе или конце игры
	 *
	 * @private
	 */
	_resetLevel() {
		const lostBalls = document.querySelectorAll('.game-screen__bullet');
		if (lostBalls) {
			[].forEach.call(lostBalls, (ball) => {
				ball.remove();
			});
		}
		if (this.bullets) {
			if (this.bullets.boundingBullet) {
				this.bullets.boundingBullet.removeEventListener('transitionend',
					this.bullets.boundingBullet.remove);
			}
			this.bullets.el.innerHTML = '';
			this.bullets = null;
		}
		if (this.circle) {
			this.circle.pauseAnimation();
			this.circle.el.innerHTML = '';
			this.circle = null;
		}
	}

	/**
	 * Проверка правильности попадания и продолжение игры с новой пулей или экран проигрыша
	 *
	 * @private
	 */
	_onHit() {
		this.bullets.activeBullet.removeEventListener('animationend', this._onHit.bind(this));
		this.bullets.rebound();
		this.circle.getHitSector();
		if (this.circle.hitSectorColor === this.bullets.activeBulletColor) {
			this.circle.deleteHitSector();
			this._levelPassed();
			if (this.bullets) {
				this.bullets.reset();
			}
		} else {
			this._resetLevel();
			this.interface.showLoseScreen();
		}
	}

	/**
	 * Проверка, пройден ли уровень
	 *
	 * @private
	 */
	_levelPassed() {
		if (!this.circle.el.children.length) {
			this._resetLevel();
			this.interface.showWinScreen();
			if (this.congrats) {
				this.congrats.remove();
				this.interface.winScreen.insertBefore(this.interface.winVerdict,
					this.interface.winContinue);
			}
			if (this.levelNumber >= this.numberOfPresetedLevels) {
				this.congrats = document.createElement('p');
				this.congrats.innerHTML = `You have passed all ${this.numberOfPresetedLevels} levels! <br>
					Now you can play the game in the infinite mode.`;
				this.interface.winScreen.insertBefore(this.congrats, this.interface.winContinue);
				this.interface.winVerdict.remove();
				this.levelNumber = '∞';
				localStorage.setItem('levelNumber', '∞');
			} else if (this.levelNumber !== '∞') {
				this.levelNumber++;
				localStorage.setItem('levelNumber', this.levelNumber);
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
		if ((event.target.dataset.action !== 'pause') && (this.clickable)) {
			this.bullets.fire();
			this.bullets.activeBullet.addEventListener('animationend', this._onHit.bind(this));
			this.clickable = false;
			this.clickableTimeout = setTimeout(this._makeClickable.bind(this), 300);
		}
	}

	/**
	 * Обработчик таймаута для предотвращения двойного клика
	 *
	 * @private
	 */
	_makeClickable() {
		clearTimeout(this.clickableTimeout);
		this.clickable = true;
	}

	/**
	 * Пауза игры
	 *
	 * @private
	 */
	_pauseGame() {
		this._isPaused = true;
		this.interface.showPauseScreen();
		this.circle.pauseAnimation();
	}

	/**
	 * Обработка событий клика по кнопкам меню
	 *
	 * @param	{Event} click event
	 */
	initClickEvents(event) {
		event.preventDefault();

		switch (event.target.dataset.action) {
		case 'newgame':
			localStorage.clear();
			this.levelNumber = 1;
			this._initNewGame(this.levelNumber);
			break;
		case 'continue':
			this.levelNumber = this.utils.getLevelFromStorage();
			this._initNewGame(this.levelNumber);
			break;
		case 'choose':
			this.levelsToShow = [1];
			switch (this.utils.getLevelFromStorage()) {
			case '∞':
				for (let i = 1; i < this.numberOfPresetedLevels; i++) {
					this.levelsToShow.push(i + 1);
				}
				this.levelsToShow.push('∞');
				break;
			case null:
				break;
			default:
				for (let i = 1; i < this.utils.getLevelFromStorage(); i++) {
					this.levelsToShow.push(i + 1);
				}
				break;
			}
			this._renderLevelsScreen();
			this.utils.changeUrl('#levels');
			this.interface.showLevelsScreen();
			break;
		case 'continue-chosen':
			this.levelNumber = event.target.textContent;
			this._initNewGame(this.levelNumber);
			break;
		case 'pause':
			this._pauseGame();
			break;
		case 'continue-pause':
			this._isPaused = false;
			this.interface.showGameScreen();
			this.circle.continueAnimation();
			break;
		case 'exit':
			this._resetLevel();
			this.interface.showStartScreen();
			this.interface.isContinuable();
			break;
		case 'nextlevel':
			this._initNewGame(this.levelNumber);
			break;
		default:
			break;
		}
	}

	/**
	 * Запуск уровня, соответствующего URL в адресной строке
	 * Если уровень ещё не открыт - редирект на главную страницу
	 *
	 * @private
	 */
	checkLocation() {
		this.levelHash = location.hash.split('/')[1];
		if ((location.hash.indexOf('#level/') > -1) &&
		((this.utils.getLevelFromStorage()) &&
		(this.levelHash <= this.utils.getLevelFromStorage()) ||
		(+this.levelHash === 1))) {
			this.levelNumber = this.levelHash;
			this._initNewGame(this.levelNumber);
		} else {
			this._resetLevel();
			this.interface.showStartScreen();
			this.interface.isContinuable();
		}
	}

	/**
	 * Отрисовка уровней на экране выбора уровней
	 *
	 * @private
	 */
	_renderLevelsScreen() {
		this.interface.levelItems.innerHTML = '';
		const levelToChose = document.createElement('div');
		levelToChose.classList.add('levels-screen__level-item');
		levelToChose.setAttribute('data-action', 'continue-chosen');
		this.levelsToShow.forEach(level => {
			const newLevelToChose = levelToChose.cloneNode();
			newLevelToChose.innerHTML = level;
			this.interface.levelItems.appendChild(newLevelToChose);
		});
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
				this.bullets.fire();
				break;
			default:
				break;
			}
		}
	}


	// Подсчет переменных, зависящих от размера экрана
	getGameMetrics() {
		this.circle.getCircleMetrics();
		this.bullets.getBulletsMetrics();
	}

}
