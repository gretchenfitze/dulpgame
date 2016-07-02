/**
* @module UI module
*/

export default class Interface {
	constructor() {
		this.startScreen = document.querySelector('.screen__start');
		this.gameScreen = document.querySelector('.screen__game');
		this.endScreen = document.querySelector('.screen__end');
	}

	_hideElement(element) {
		element.classList.add('invisible');
	}

	_showElement(element) {
		element.classList.remove('invisible');
	}

	showGameScreen() {
		this._showElement(this.gameScreen);
		this._hideElement(this.startScreen);
		this._hideElement(this.endScreen);
	}
}
