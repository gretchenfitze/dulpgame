import './../../css/circle.css';
import Utilities from './Utilities.js';

/**
 * @class Circle class
 */
export default class Circle {
	constructor(level, colors) {
		this.utils = new Utilities();
		this.level = level;
		this.circleColors = colors.slice(0);
		this.colorSlice = this.level.colorSlice.slice(0);
		this.el = document.querySelector('.js-circle');
		this.center = document.querySelector('.game-screen__circle-center');
		this.circleSpeedCorrection = 5;
		this.fullCircleTime = Math.abs(1 / this.level.circleSpeed) * this.circleSpeedCorrection;
		this.utils.getKeyframesRule('rotate-change-direction');
		this._renderSlices();
	}

	/**
	* Получение значений для размера секторов круга
	*
	* @private
	*/
	_getSliceRotationDegrees() {
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

	/**
	 * Отрисовка секторов круга
	 *
	 * @private
	 */
	_renderSlices() {
		this.el.parentNode.style.height = this.el.parentNode.style.width = `${this.level.size}vh`;
		this.center.style.lineHeight = `${this.level.size * 4 / 5}vh`;
		this._showLevelNumber();
		this._getSliceRotationDegrees();
		for (let i = 0; i < this.circleColors.length; i++) {
			const newSector = document.createElement('li');
			newSector.classList.add('game-screen__circle-sector');
			newSector.style.background = this.circleColors[i];

			newSector.style.transform = newSector.style.WebkitTransform = `
				rotate(${this._rotationDegs[i]}deg)
				skew(${89 - this.colorSlice[i]}deg)
			`;
			this.el.appendChild(newSector);
		}
		if (this.level.circleSpeed < 0) {
			this.el.style.animationDirection = 'reverse';
		} else {
			this.el.style.animationDirection = 'normal';
		}
		this.el.style.WebkitAnimationDirection = this.el.style.animationDirection;

		this._resetAnimation();
	}

	// Получение цвета сектора, находящегося в нижней точке круга
	getHitSector() {
		this.hitSector = document.elementFromPoint(this.hitSectorXCoord, this.hitSectorYCoord);
		this.hitSectorColor = this.hitSector.style.backgroundColor;
	}

	// Удаление сектора при попадании
	deleteHitSector() {
		this.hitSector.remove();
		if (this.level.reverse) {
			this._toggleRotationDirection();
			this.el.addEventListener('animationend', this._resetAnimation.bind(this));
		}
	}

	/**
	* Смена направления вращения
	*
	* @private
	*/
	_toggleRotationDirection() {
		this.pauseAnimation();
		this._getRotationValues();

		if (this.el.style.animationDirection === 'reverse') {
			this.el.style.animationDirection = this.el.style.WebkitAnimationDirection =
				'normal';
			this._changeKeyframesRule(this.rotatedAngle, 360, 360 - this.rotatedAngle);
		} else {
			this.el.style.animationDirection = this.el.style.WebkitAnimationDirection =
				'reverse';
			this._changeKeyframesRule(0, this.rotatedAngle, this.rotatedAngle);
		}
		this.continueAnimation();
	}

	// Пауза анимации
	pauseAnimation() {
		this.el.style.animationPlayState = this.el.style.WebkitAnimationPlayState =
		'paused';
		this._getRotationValues();
		this.el.classList.add('no-animation');
		this.el.style.transform = this.el.style.WebkitTransform = `rotate(${this.rotatedAngle}deg)`;
	}

	// Продолжение анимации
	continueAnimation() {
		this.el.classList.remove('no-animation');
		this.el.style.animationPlayState = this.el.style.WebkitAnimationPlayState =
			'running';
	}

	/**
	* Получение размера угла, на который совершен поворот круга в данный момент
	*
	* @private
	*/
	_getRotationValues() {
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

	/**
	 * Изменение правил анимации для смены направления вращения
	 *
	 * @param  {Number} ruleFromDegrees Начальная точка анимации в градусах поворота
	 * @param  {Number} ruleToDegrees   Конечная точка анимации в градусах поворота
	 * @param  {Number} timeIndex       Градусы поворота? оставшиеся до конца анимации
	 * @private
	 */
	_changeKeyframesRule(ruleFromDegrees, ruleToDegrees, timeIndex) {
		this.el = this.utils.replaceElement(this.el);

		this.utils._keyframes.forEach((_keyframe) => {
			_keyframe.deleteRule('0%');
			_keyframe.deleteRule('100%');
			_keyframe.appendRule(
				`0% {
					transform: translate3d(0,0,0) rotate(${ruleFromDegrees}deg);
					-webkit-transform: translate3d(0,0,0) rotate(${ruleFromDegrees}deg);
				}`);
			_keyframe.appendRule(
				`100% {
					transform: translate3d(0,0,0) rotate(${ruleToDegrees}deg);
					-webkit-transform: translate3d(0,0,0) rotate(${ruleToDegrees}deg);
				}`);
		});

		this.el.style.animationName = this.el.style.WebkitAnimationName =
			'rotate-change-direction';

		this.el.style.animationDuration = this.el.style.WebkitAnimationDuration =
			`${this.fullCircleTime / 360 * timeIndex}s`;

		this.el.style.animationIterationCount = this.el.style.WebkitAnimationIterationCount =
			'1';
	}

	/**
	 * Продолжить анимацию в обычном порядке
	 *
	 * @private
	 */
	_resetAnimation() {
		this.el.style.animationName = this.el.style.WebkitAnimationName =
			'rotate';

		this.el.style.animationDuration = this.el.style.WebkitAnimationDuration =
			`${this.fullCircleTime}s`;

		this.el.style.animationIterationCount = this.el.style.WebkitAnimationIterationCount =
			'infinite';

		this.el.style.animationTimingFunction = this.el.style.WebkitAnimationTimingFunction =
			'linear';

		this.el.removeEventListener('animationend', this._resetAnimation.bind(this));
	}

	// Получение координат для круга
	getCircleMetrics() {
		this.hitSectorXCoord = Math.max(document.documentElement.clientWidth,
			window.innerWidth || 0) / 2;
		this.hitSectorYCoord = this.el.offsetParent.offsetTop + this.el.clientHeight -
			(this.el.clientHeight - this.center.clientHeight) / 4;
	}
}
