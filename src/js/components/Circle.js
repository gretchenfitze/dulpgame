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
		this._renderCircle();
		this.center.innerHTML = this.level.name;
	}

	/**
	* Получение значений для размера секторов круга
	*
	* @private
	*/
	_getSliceRotationDegrees() {
		const _rotationDegs = [0];
		let _rotationDeg = 0;
		for (let i = 0; i < this.circleColors.length; i++) {
			_rotationDeg += +this.colorSlice[i];
			_rotationDegs.push(_rotationDeg);
		}
		return _rotationDegs;
	}

	/**
	 * Отрисовка круга
	 *
	 * @private
	 */
	_renderCircle() {
		this.el.parentNode.style.height = this.el.parentNode.style.width = `${this.level.size}vh`;
		this.center.style.lineHeight = `${this.level.size * 4 / 5}vh`;
		const rotationDegrees = this._getSliceRotationDegrees();
		for (let i = 0; i < this.circleColors.length; i++) {
			const newSector = document.createElement('li');
			newSector.classList.add('game-screen__circle-sector');
			newSector.style.background = this.circleColors[i];

			newSector.style.transform = newSector.style.WebkitTransform = `
				rotate(${rotationDegrees[i]}deg)
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
	getHitSectorColor() {
		this.hitSector = document.elementFromPoint(this.hitSectorXCoord, this.hitSectorYCoord);
		return this.hitSector.style.backgroundColor;
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
		const rotationAngle = this._getRotationAngle();

		if (this.el.style.animationDirection === 'reverse') {
			this.el.style.animationDirection = this.el.style.WebkitAnimationDirection =
				'normal';
			this._changeKeyframesRule(rotationAngle, 360, 360 - rotationAngle);
		} else {
			this.el.style.animationDirection = this.el.style.WebkitAnimationDirection =
				'reverse';
			this._changeKeyframesRule(0, rotationAngle, rotationAngle);
		}
	}

	// Остановка анимации
	stopAnimation() {
		this.el.style.transform = this.el.style.WebkitTransform =
			`translate3d(0,0,0) rotate(${this._getRotationAngle()}deg)`;
		this.el.style.animationName = this.el.style.WebkitAnimationName = 'none';
	}

	/**
	* Получение размера угла, на который совершен поворот круга в данный момент
	*
	* @private
	*/
	_getRotationAngle() {
		const _tr = window.getComputedStyle(this.el).getPropertyValue('transform');
		const _values = _tr.split('(')[1].split(')')[0].split(',');
		let _rotationAngle = Math.atan2(_values[1], _values[0]) * (180 / Math.PI);
		if (_rotationAngle < 0) {
			_rotationAngle += 360;
		}
		return _rotationAngle;
	}

	/**
	 * Изменение правил анимации для смены направления вращения
	 *
	 * @param  {Number} ruleFromDegrees Начальная точка анимации в градусах поворота
	 * @param  {Number} ruleToDegrees   Конечная точка анимации в градусах поворота
	 * @param  {Number} timeIndex       Градусы поворота, оставшиеся до конца анимации
	 * @private
	 */
	_changeKeyframesRule(ruleFromDegrees, ruleToDegrees, timeIndex) {
		this.el = this.utils.replaceElement(this.el);

		this.utils.keyframes.forEach((keyframe) => {
			keyframe.deleteRule('0%');
			keyframe.deleteRule('100%');
			keyframe.appendRule(
				`0% {
					transform: translate3d(0,0,0) rotate(${ruleFromDegrees}deg);
					-webkit-transform: translate3d(0,0,0) rotate(${ruleFromDegrees}deg);
				}`);
			keyframe.appendRule(
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
