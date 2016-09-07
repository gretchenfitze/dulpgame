import './../../css/bullets.css';
import Utilities from './Utilities.js';

/**
 * @class Bullets class
 */
export default class Bullets {
	constructor(level, colors) {
		this.utils = new Utilities();
		this.level = level;
		this.colors = colors;
		this._shuffleBullets(this.colors);
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
			this.activeBullet.style.transition = 'none';
			this.activeBullet.style.transform = this.activeBullet.style.WebkitTransform =
				'translate3d(0,0,0) translate(-50%, -50%)';
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
		this.boundingBullet = this.activeBullet;
		this.boundingBullet.style.animationName = this.boundingBullet.style.WebkitAnimationName =
			'none';
		this.boundingBullet.style.transform = this.boundingBullet.style.WebkitTransform =
			this._fireTransform;

		if (this.boundingBullet) {
			this._distanceFromCircleToBottom = document.documentElement.clientHeight -
			this.circle.offsetParent.offsetTop - this.circle.clientHeight;

			const boundAngle = this.utils.degreesToRads(
				this.utils.randomize(this.boundAngleMin, this.boundAngleMax));

			const reboundPath = this._distanceFromCircleToBottom /
				Math.sin(this.utils.degreesToRads(90) - boundAngle) * this.reboundPathCorrection;

			let boundPathX = -reboundPath * Math.sin(boundAngle);
			const boundPathY = reboundPath * Math.cos(boundAngle);

			if (this.level.circleSpeed < 0) {
				boundPathX = -boundPathX;
			}
			if ((this.level.reverse) && (this.boundedBullets % 2)) {
				boundPathX = -boundPathX;
			}

			this.boundingBullet.style.transition = `transform ${this.reboundSpeedCorrection /
				this.level.bulletSpeed * (reboundPath / this._bulletFirePath)}ms
			cubic-bezier(.12,.07,.29,.74)`;

			this.boundingBullet.style.transform = this.boundingBullet.style.WebkitTransform =
				`translate3d(0,0,0) translate(${boundPathX}px, ${boundPathY}px)`;

			this.boundingBullet.addEventListener('transitionend', this.boundingBullet.remove);
			this.boundedBullets++;
		}
	}

	// Получение координат для пуль
	getBulletsMetrics() {
		this._bulletFirePath = this.activeBullet.offsetTop - this.circle.offsetParent.offsetTop -
			this.circle.clientHeight;

		this._fireTransform = `translate3d(0,0,0) translate(-50%, -${this._bulletFirePath}px)`;
		this.utils._keyframes.forEach((_keyframe) => {
			_keyframe.deleteRule('100%');
			_keyframe.appendRule(
				`100% {
					transform: ${this._fireTransform};
					-webkit-transform: ${this._fireTransform};
				}`);
		});
	}
}
