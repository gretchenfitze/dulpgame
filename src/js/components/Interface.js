/**
* @module UI module
*/
export default class Interface {
	constructor() {
		this.startScreen = document.querySelector('.screen__start');
		this.gameScreen = document.querySelector('.screen__game');
		this.pauseScreen = document.querySelector('.screen__pause');
		this.initInterface();
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

	initInterface() {
		document.body.addEventListener('click', this._onClick.bind(this));
	}

	/**
	 * @param	{Event} event
	 * @private
	 */
	_onClick(event) {
		event.preventDefault();

		switch (event.target.dataset.action) {
		case 'newgame':
			// + добавить Удаление данных о всех пройденных уровнях
			this.showGameScreen();
			break;
		case 'continue':
			// + добавить Загрузку из кукис данных о последнем законченном уровне
			this.showGameScreen();
			break;
		case 'pause':
			this.showPauseScreen();
			break;
		case 'exit':
			// + добавить Удаление данных уровня, сохранение в кукис данных о последнем законченном уровне
			this.showStartScreen();
			break;
		default:
			break;
		}
	}

}
