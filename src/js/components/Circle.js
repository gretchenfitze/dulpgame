import './../../css/circle.css';

/**
 * @class Circle class
 */
export default class Circle {
	constructor(level, colors) {
		this.level = level;
		this.circleColors = colors.slice(0);
		this.colorSlice = this.level.colorSlice.slice(0);
		this.el = document.querySelector('.js-circle');
		this.center = document.querySelector('.circle__center');
		this.circleSpeed = this.level.circleSpeed;
	}

	/**
	* Получение значений для размера секторов круга
	*
	* @private
	*/
	_getRotationDegs() {
		this._rotationDegs = [0];
		this._rotationDeg = 0;
		for (let i = 0; i < this.circleColors.length; i++) {
			this._rotationDeg += +this.colorSlice[i];
			this._rotationDegs.push(this._rotationDeg);
		}
	}

	/**
	 * Отображение номера уровня в центре круга
	 *
	 * @private
	 */
	_showLevelNumber() {
		this.center.innerHTML = this.level.name;
	}

	// Прорисовка секторов круга
	renderSlices() {
		this.el.parentNode.style.height = this.el.parentNode.style.width = `${this.level.size}vh`;
		this.center.style.lineHeight = `${this.level.size * 4 / 5}vh`;
		this._showLevelNumber();
		this._getRotationDegs();
		for (let i = 0; i < this.circleColors.length; i++) {
			const newSector = document.createElement('li');
			newSector.classList.add('circle__part');
			newSector.style.background = this.circleColors[i];

			newSector.style.transform = `
				rotate(${this._rotationDegs[i]}deg)
				skew(${89 - this.colorSlice[i]}deg)
			`;
			this.el.appendChild(newSector);
		}
		if (this.circleSpeed < 0) {
			this.el.style.animationDirection = 'reverse';
		}
		this.el.style.animationDuration = `${Math.abs(this.circleSpeed)}s`;
	}

	// Получение цвета сектора, находящегося в нижней точке круга
	getHitSector() {
		this.x = Math.max(document.documentElement.clientWidth,
			window.innerWidth || 0) / 2;
		this.y = this.el.parentNode.offsetTop + this.el.clientHeight -
			(this.el.clientHeight - this.center.clientHeight) / 4;
		this.hitSector = document.elementFromPoint(this.x, this.y);
		this.hitSectorColor = this.hitSector.style.backgroundColor;
	}

	// Удаление сектора при попадании
	deleteHitSector() {
		this.hitSector.remove();
		// if ((this.level.reverse) && (this.el.style.animationDirection === 'reverse')) {
		// 	this.el.style.webkitAnimationPlayState = 'paused';
		// 	this.changeKeyframesRule();
		// 	this.el.style.animationDirection = 'normal';
		// 	this.el.style.webkitAnimationPlayState = 'running';
		// } else if (this.level.reverse) {
		// 	this.el.style.webkitAnimationPlayState = 'paused';
		// 	this.changeKeyframesRule();
		// 	this.el.style.animationDirection = 'reverse';
		// 	this.el.style.webkitAnimationPlayState = 'running';
		// }
	}

	_getRotationValuesForReverse() {
		const tr = window.getComputedStyle(this.el).getPropertyValue('transform');
		let values = tr.split('(')[1];
		values = values.split(')')[0];
		values = values.split(',');
		const a = values[0];
		const b = values[1];
		this.rotatedAngle = Math.atan2(b, a) * (180 / Math.PI);
		if (this.rotatedAngle < 0) {
			this.rotatedAngle += 360;
		}
	}

	changeKeyframesRule() {
		this._getRotationValuesForReverse();
		const ss = document.styleSheets;
		for (let i = 0; i < ss.length; ++i) {
			for (let j = 0; j < ss[i].cssRules.length; ++j) {
				if (ss[i].cssRules[j].type === window.CSSRule.WEBKIT_KEYFRAMES_RULE &&
					ss[i].cssRules[j].name === 'rotate') {
					this._keyframes = ss[i].cssRules[j];
				}
			}
		}
		this._keyframes.deleteRule('from');
		this._keyframes.deleteRule('to');

		this._keyframes.appendRule(
			`from {
				transform: rotate(${this.rotatedAngle}deg);
				-webkit-transform: rotate(${this.rotatedAngle}deg);
			}`);
		this._keyframes.appendRule(
			`to {
				transform: rotate(${this.rotatedAngle + 360}deg);
				-webkit-transform: rotate(${this.rotatedAngle + 360}deg);
		}`);
	}
}
