/**
* @module UI module
*/
export default class Interface {
	constructor() {
		this.startScreen = document.querySelector('.screen__start');
		this.gameScreen = document.querySelector('.screen__game');
		this.pauseScreen = document.querySelector('.screen__pause');
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

	showStartScreen() {
		this._hideElement(this.gameScreen);
		this._showElement(this.startScreen);
		this._hideElement(this.pauseScreen);
	}

	showGameScreen() {
		this._showElement(this.gameScreen);
		this._hideElement(this.startScreen);
		this._hideElement(this.pauseScreen);
	}

	showPauseScreen() {
		this._hideElement(this.gameScreen);
		this._showElement(this.pauseScreen);
	}

}
