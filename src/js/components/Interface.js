import Utilities from './Utilities.js';

/**
* @module UI module
*/
export default class Interface {
	constructor() {
		this.utils = new Utilities();
		this.startScreen = document.querySelector('.start-screen');
		this.continueButton = this.startScreen.querySelector('.start-screen__continue');
		this.isContinuable();
		this.gameScreen = document.querySelector('.game-screen');
		this.pauseScreen = document.querySelector('.pause-screen');
		this.winScreen = document.querySelector('.win-screen');
		this.loseScreen = document.querySelector('.lose-screen');
		this.levelsScreen = document.querySelector('.levels-screen');
		this.winVerdict = document.querySelector('.win-screen__verdict');
		this.winContinue = document.querySelector('.win-screen__continue');
		this.congrats = document.querySelector('.win-screen__congrats');
	}

	/**
	 * Показать нужный экран и скрыть остальные экраны
	 *
	 * @param  {HTMLElement} element
	 */
	showScreen(element) {
		for (let i = 0, l = document.body.children.length - 1; i < l; i++) {
			document.body.children[i].classList.add('invisible');
		}
		element.classList.remove('invisible');
	}

	// Проверка, можно ли продолжить игру
	isContinuable() {
		if (this.utils.getLevelFromStorage() !== 1) {
			this.continueButton.classList.remove('invisible');
		} else {
			this.continueButton.classList.add('invisible');
		}
	}

	/**
	 * Отрисовка экрана выбора уровней
	 *
	 * @param {Number} Preseted levels
	 */
	renderLevelsScreen(numberOfPresetedLevels) {
		this.levelsToShow = [1];
		const levelNumber = this.utils.getLevelFromStorage();
		if (levelNumber === 'random') {
			for (let i = 1; i < numberOfPresetedLevels; i++) {
				this.levelsToShow.push(i + 1);
			}
			this.levelsToShow.push('∞');
		} else {
			for (let i = 1; i < levelNumber; i++) {
				this.levelsToShow.push(i + 1);
			}
		}
		this._renderLevelsScreenItems();
		this.utils.changeUrl('#levels');
		this.showScreen(this.levelsScreen);
	}

	/**
	 * Создание элементов уровней на экране выбора уровней
	 *
	 * @private
	 */
	_renderLevelsScreenItems() {
		const levelItems = document.querySelector('.levels-screen__level-items');
		levelItems.innerHTML = '';
		const levelToChose = document.createElement('div');
		levelToChose.classList.add('levels-screen__level-item');
		levelToChose.setAttribute('data-action', 'continue-chosen');
		this.levelsToShow.forEach(level => {
			const newLevelToChose = levelToChose.cloneNode();
			newLevelToChose.innerHTML = level;
			levelItems.appendChild(newLevelToChose);
		});
	}

	// Выход в главное меню
	exitToMainMenu() {
		this.utils.changeUrl('#');
		this.showScreen(this.startScreen);
		this.isContinuable();
	}

	showCongratulations() {
		this.congrats.classList.remove('invisible');
		this.winVerdict.classList.add('invisible');
	}

	showWinScreen() {
		this.showScreen(this.winScreen);
		if (!this.congrats.classList.contains('invisible')) {
			this.congrats.classList.add('invisible');
			this.winVerdict.classList.remove('invisible');
		}
	}
}
