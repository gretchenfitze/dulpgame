/**
* @module Help utilities module
*/
export default class Utilities {

	/**
	 * Смена состояния адресной строки
	 *
	 * @param {String} href
	 */
	changeUrl(href) {
		history.pushState(null, null, href);
	}

	/**
	 * Получение номера уровня из localStorage
	 *
	 * @return {Number|String}
	 */
	getLevelFromStorage() {
		return localStorage.getItem('levelNumber') || 1;
	}

	/**
	 * Преобразование градусов в радианы
	 *
	 * @param  {Number} angle in degrees
	 * @return {Number} angle in rads
	 */
	degreesToRads(angle) {
		return angle * (Math.PI / 180);
	}

	// Копирование элемента для рестарта анимации
	replaceElement(el) {
		const copy = el.cloneNode(true);
		el.parentNode.replaceChild(copy, el);
		return copy;
	}

	/**
	 * Поиск CSS-правила для анимации
	 *
	 * @param {String} CSS rule name
	 */
	getKeyframesRule(rule) {
		this.keyframes = [];
		const ss = document.styleSheets;
		for (let i = 0; i < ss.length; ++i) {
			for (let j = 0; j < ss[i].cssRules.length; ++j) {
				if (ss[i].cssRules[j].name === rule) {
					this.keyframes.push(ss[i].cssRules[j]);
				}
			}
		}
	}

	/**
	 * Получить случайные значения из диапазона
	 *
	 * @param  {Number} minimal value
	 * @param  {Number} maximum value
	 * @return {Number} random number
	 */
	randomize(min, max) {
		return min + Math.random() * (max - min);
	}
}
