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
		this.levelItems = document.querySelector('.levels-screen__level-items');
	}

	/**
	 * @param  {HTMLElement} element
	 * @private
	 */
	_hideElement(element) {
		element.classList.add('invisible');
	}

	/**
	 * @param  {HTMLElement} element
	 * @private
	 */
	_showElement(element) {
		element.classList.remove('invisible');
	}

	isContinuable() {
		if ((this.utils.getLevelFromStorage() === '∞') ||
			(+this.utils.getLevelFromStorage() > 1)) {
			this._showElement(this.continueButton);
		} else {
			this._hideElement(this.continueButton);
		}
	}

	showStartScreen() {
		this._hideElement(this.gameScreen);
		this.utils.changeUrl('#');
		this._showElement(this.startScreen);
		this._hideElement(this.pauseScreen);
		this._hideElement(this.loseScreen);
		this._hideElement(this.winScreen);
		this._hideElement(this.levelsScreen);
	}

	showGameScreen() {
		this._showElement(this.gameScreen);
		this._hideElement(this.startScreen);
		this._hideElement(this.levelsScreen);
		this._hideElement(this.pauseScreen);
		this._hideElement(this.loseScreen);
		this._hideElement(this.winScreen);
	}

	showPauseScreen() {
		this._hideElement(this.gameScreen);
		this._showElement(this.pauseScreen);
	}

	showWinScreen() {
		this._hideElement(this.gameScreen);
		this._showElement(this.winScreen);
	}

	showLoseScreen() {
		this._hideElement(this.gameScreen);
		this._showElement(this.loseScreen);
	}

	showLevelsScreen() {
		this._hideElement(this.startScreen);
		this._showElement(this.levelsScreen);
	}
}
