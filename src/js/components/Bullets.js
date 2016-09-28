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
		this.reboundPathCorrection = 4 / 3;
		this.boundAngleMin = 15;
		this.boundAngleMax = 40;
		this.boundedBullets = 0;
		this._renderBullets();
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
		this.activeBullet.style.transition = this.activeBullet.style.WebkitTransition =
			`top ${this.fireTime}ms linear`;
		this.activeBullet.style.top = `${this.collosionCoordinateY}px`;
	}

	// Перезарядка пули
	reset() {
		this._makeActiveBullet();
		this.circle = document.querySelector('.js-circle');
	}

	/**
	 * Возможность пули отлетать после удара в сторону кручения круга
	 *
	 * @private
	 */
	_rebounding() {
		const boundAngle = this.utils.degreesToRads(
			this.utils.randomize(this.boundAngleMin, this.boundAngleMax));
		const distanceFromCircleToBottom = document.documentElement.clientHeight -
			this.collosionCoordinateY;

		const reboundPath = distanceFromCircleToBottom /
			Math.sin(this.utils.degreesToRads(90) - boundAngle) * this.reboundPathCorrection;

		let boundPathX = -reboundPath * Math.sin(boundAngle);
		const boundPathY = reboundPath * Math.cos(boundAngle);

		if (this.level.circleSpeed < 0) {
			boundPathX = -boundPathX;
		}
		if ((this.level.reverse) && (this.boundedBullets % 2)) {
			boundPathX = -boundPathX;
		}
		const reboundTransitionProperty = `transform ${this.fireTime * (reboundPath /
			this.firePath)}ms cubic-bezier(.6,.52,.46,.93)`;
		this.boundingBullet.style.transition = reboundTransitionProperty;
		this.boundingBullet.style.WebkitTransition = `-webkit-${reboundTransitionProperty}`;

		this.boundingBullet.style.transform = this.boundingBullet.style.WebkitTransform =
			`translateZ(0) translate3d(0,0,0) translate(${boundPathX}px, ${boundPathY}px)`;

		this.boundingBullet.addEventListener('transitionend', this.boundingBullet.remove);
		this.boundedBullets++;
	}

	// Замена элемента пули и отскок
	rebound() {
		const LAST_FRAME_TIMEOUT = 7;
		this.boundingBullet = this.utils.replaceElement(this.activeBullet);
		setTimeout(this._rebounding.bind(this), LAST_FRAME_TIMEOUT);
	}

	// Получение координат для пуль
	getBulletsMetrics() {
		this.collosionCoordinateY = this.circle.offsetParent.offsetTop + this.circle.clientHeight;
		this.fireTime = this.bulletSpeedCorrection / this.level.bulletSpeed;
		this.firePath = this.activeBullet.offsetTop - this.collosionCoordinateY;
	}

	// Полет пули до центрального элемента круга, если сектор попадания пуст
	fireToTheCircleCenter() {
		const _circleSectorWidth = (this.circle.clientHeight -
			this.circle.nextElementSibling.clientHeight) / 2;

		this.activeBullet.style.transition = this.activeBullet.style.WebkitTransition =
			`top ${this.fireTime * (_circleSectorWidth / this.collosionCoordinateY)}ms linear`;

		this.activeBullet.style.top = `${this.collosionCoordinateY - _circleSectorWidth}px`;
	}
}
