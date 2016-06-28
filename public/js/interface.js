'use strict';

(function() {
  let startScreen = document.querySelector('.screen__start');
  let startButton = document.querySelector('.btn__start');
  let gameScreen = document.querySelector('.screen__game');
  let endScreen = document.querySelector('.screen__end');


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
  };

  startButton.addEventListener('click', showGameScreen);

})();
