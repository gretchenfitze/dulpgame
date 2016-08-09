/**
* @module UI module
*/
export default class Interface {
	constructor() {
		this.startScreen = document.querySelector('.screen__start');
		this.continueButton = this.startScreen.querySelector('.btn__continue');
		this.isContinuable();
		this.gameScreen = document.querySelector('.screen__game');
		this.pauseScreen = document.querySelector('.screen__pause');
		this.winScreen = document.querySelector('.screen__win');
		this.loseScreen = document.querySelector('.screen__lose');
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
		if (localStorage.getItem('levelNumber') > 1) {
			this._showElement(this.continueButton);
		} else {
			this._hideElement(this.continueButton);
		}
	}

	showStartScreen() {
		this._hideElement(this.gameScreen);
		history.replaceState(null, null, '#');
		this._showElement(this.startScreen);
		this._hideElement(this.pauseScreen);
		this._hideElement(this.loseScreen);
		this._hideElement(this.winScreen);
	}

	showGameScreen() {
		this._showElement(this.gameScreen);
		this._hideElement(this.startScreen);
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

}
