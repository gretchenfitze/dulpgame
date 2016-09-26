import './../../css/bullets.css';
import Utilities from './Utilities.js';

/**
 * @class Bullets class
 */
export default class Bullets {
	constructor(level, colors) {
		this.utils = new Utilities();
		this.level = level;
		this._shuffleBullets(colors);
		this.el = document.querySelector('.js-bullets');
		this.circle = document.querySelector('.js-circle');
		this.bulletSpeedCorrection = 400;
		this.reboundSpeedCorrection = 1000;
		this.reboundPathCorrection = 4 / 3;
		this.boundAngleMin = 15;
		this.boundAngleMax = 40;
		this.boundedBullets = 0;
		this._renderBullets();
		this.utils.getKeyframesRule('hit');
	}

	/**
	 * Перемешивание цветов пуль, чтобы они не шли по порядку как сектора круга
	 *
	 * @param  {Array} level colors
	 */
	_shuffleBullets(colors) {
		this.bulletColors = colors.slice(0);
		for (let i = this.bulletColors.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = this.bulletColors[i];
			this.bulletColors[i] = this.bulletColors[j];
			this.bulletColors[j] = temp;
		}
	}

	/**
	 * Отрисовка пуль
	 *
	 * @private
	 */
	_renderBullets() {
		const li = document.createElement('li');
		li.classList.add('game-screen__bullet');

		this.bulletColors.forEach(color => {
			const newBullet = li.cloneNode();
			newBullet.style.background = color;
			this.el.appendChild(newBullet);
		});

		this._makeActiveBullet();
	}

	/**
	 * Установка активной пули
	 *
	 * @private
	 */
	_makeActiveBullet() {
		this.activeBullet = this.el.childNodes[0];
		if (this.activeBullet) {
			this.activeBullet.classList.add('game-screen__bullet_active');
			this.activeBulletColor = this.activeBullet.style.backgroundColor;
			this.el.parentNode.insertBefore(this.activeBullet, this.el);
		}
	}

	// Пуск пули
	fire() {
		this.activeBullet.style.animationName = this.activeBullet.style.WebkitAnimationName =
			'hit';

		this.activeBullet.style.animationDuration = this.activeBullet.style.WebkitAnimationDuration =
			`${this.bulletSpeedCorrection / this.level.bulletSpeed}ms`;
	}

	// Перезарядка пули
	reset() {
		this._makeActiveBullet();
		this.circle = document.querySelector('.js-circle');
	}

	// Возможность пули отлетать после удара в сторону кручения круга
	rebound() {
		const _boundingBullet = this.activeBullet;
		_boundingBullet.style.transform = _boundingBullet.style.WebkitTransform =
		this.fireTransform;
		_boundingBullet.style.animationName = _boundingBullet.style.WebkitAnimationName =
			'none';

		const boundAngle = this.utils.degreesToRads(
			this.utils.randomize(this.boundAngleMin, this.boundAngleMax));

		const reboundPath = (document.documentElement.clientHeight - this.impactPoint) /
			Math.sin(this.utils.degreesToRads(90) - boundAngle) * this.reboundPathCorrection;

		let boundPathX = -reboundPath * Math.sin(boundAngle);
		const boundPathY = reboundPath * Math.cos(boundAngle);

		if (this.level.circleSpeed < 0) {
			boundPathX = -boundPathX;
		}
		if ((this.level.reverse) && (this.boundedBullets % 2)) {
			boundPathX = -boundPathX;
		}

		const reboundTransitionProperty = `transform ${this.reboundSpeedCorrection /
			this.level.bulletSpeed * (reboundPath / this.bulletFirePath)}ms
			cubic-bezier(.12,.07,.29,.74)`;
		_boundingBullet.style.transition = reboundTransitionProperty;
		_boundingBullet.style.WebkitTransition = `-webkit-${reboundTransitionProperty}`;

		_boundingBullet.style.transform = _boundingBullet.style.WebkitTransform =
			`translate3d(0,0,0) translate(${boundPathX}px, ${boundPathY}px)`;

		_boundingBullet.addEventListener('transitionend', _boundingBullet.remove);
		this.boundedBullets++;
	}

	// Получение координат для пуль
	getBulletsMetrics() {
		this.impactPoint = this.circle.offsetParent.offsetTop + this.circle.clientHeight;
		this.bulletFirePath = this.activeBullet.offsetTop - this.impactPoint;
		this.fireTransform = `translate3d(0,0,0) translate(-50%, -${this.bulletFirePath}px)`;
		this.utils.keyframes.forEach((keyframe) => {
			keyframe.deleteRule('100%');
			keyframe.appendRule(
				`100% {
					transform: ${this.fireTransform};
					-webkit-transform: ${this.fireTransform};
				}`);
		});
	}

	// Полет пули до центрального элемента круга, если сектор попадания пуст
	fireToTheCircleCenter() {
		this.activeBullet.style.animationName = this.activeBullet.style.WebkitAnimationName =
			'none';
		this.activeBullet.style.transform = this.activeBullet.style.WebkitTransform =
			this.fireTransform;

		const _circleSectorWidth = (this.circle.clientHeight -
			this.circle.nextElementSibling.clientHeight) / 2;

		const _addedTransitionProperty = `transform ${(this.bulletSpeedCorrection /
			this.level.bulletSpeed) * (_circleSectorWidth / this.bulletFirePath)}ms`;
		this.activeBullet.style.transition = _addedTransitionProperty;
		this.activeBullet.style.WebkitTransition = `-webkit-${_addedTransitionProperty}`;
		this.activeBullet.style.transform = this.activeBullet.style.WebkitTransform =
			`translate3d(0,0,0) translate(-50%, -${this.bulletFirePath + _circleSectorWidth}px)`;
	}
}
