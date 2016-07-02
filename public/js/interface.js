/**
* @module UI module
*/

const startScreen = document.querySelector('.screen__start');
const startButton = document.querySelector('.btn__start');
const gameScreen = document.querySelector('.screen__game');
const endScreen = document.querySelector('.screen__end');

function hideElement(element) {
	element.classList.add('invisible');
}

function showElement(element) {
	element.classList.remove('invisible');
}

function showGameScreen() {
	hideElement(startScreen);
	hideElement(endScreen);
	showElement(gameScreen);
}

startButton.addEventListener('click', showGameScreen);
