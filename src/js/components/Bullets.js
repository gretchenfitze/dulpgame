import './../../css/bullets.css';

/**
 * @class Bullets class
 */
export default class Bullets {
	constructor(level, colors) {
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
		this._getKeyframesRule('hit');
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
			this.activeBullet.style.transform = 'translate3d(0,0,0) translate(-50%, -50%)';
			this.activeBullet.style.WebkitTransform = 'translate3d(0,0,0) translate(-50%, -50%)';
			this.activeBullet.classList.add('game-screen__bullet_active');
			this.activeBulletColor = this.activeBullet.style.backgroundColor;
			this.el.parentNode.insertBefore(this.activeBullet, this.el);
		}
	}

	// Пуск пули
	fire() {
		this.bulletFirePath = this.activeBullet.offsetTop - this.circle.offsetParent.offsetTop -
			this.circle.clientHeight;
		this.fireTransform = `translate3d(0,0,0) translate(-${this.activeBullet.clientHeight / 2}px,
			-${this.bulletFirePath}px)`;

		this._keyframes.forEach((_keyframe) => {
			_keyframe.deleteRule('100%');
			_keyframe.appendRule(
				`100% {
					transform: ${this.fireTransform};
					-webkit-transform: ${this.fireTransform};
				}`);
		});

		this.activeBullet.style.animationName = 'hit';
		this.activeBullet.style.WebkitAnimationName = 'hit';

		this.activeBullet.style.animationDuration =
			`${this.bulletSpeedCorrection / this.level.bulletSpeed}ms`;
		this.activeBullet.style.WebkitAnimationDuration =
			`${this.bulletSpeedCorrection / this.level.bulletSpeed}ms`;

		this.activeBullet.style.animationTimingFunction = 'linear';
		this.activeBullet.style.WebkitAnimationTimingFunction = 'linear'; // TODO: cubic-bezier
	}

	// Перезарядка пули
	reset() {
		this._makeActiveBullet();
		this.circle = document.querySelector('.js-circle');
	}

	// Возможность пули отлетать после удара в сторону кручения круга
	rebound() {
		this.boundingBullet = this._replaceElement(this.activeBullet);
		this.boundingBullet.style.animationName = 'none';
		this.boundingBullet.style.WebkitAnimationName = 'none';
		this.boundingBullet.style.transform = this.fireTransform;
		this.boundingBullet.style.WebkitTransform = this.fireTransform;

		if (this.boundingBullet) {
			const distanceFromCircleToBottom = document.documentElement.clientHeight -
				this.circle.offsetParent.offsetTop - this.circle.clientHeight;

			const boundAngle = this._degreesToRads(this.boundAngleMin + Math.random() *
				(this.boundAngleMax - this.boundAngleMin));

			const reboundPath = distanceFromCircleToBottom /
				Math.sin(this._degreesToRads(90) - boundAngle) * this.reboundPathCorrection;

			let boundPathX = -reboundPath * Math.sin(boundAngle);
			const boundPathY = reboundPath * Math.cos(boundAngle);

			if (this.level.circleSpeed < 0) {
				boundPathX = -boundPathX;
			}
			if ((this.level.reverse) && (this.boundedBullets % 2)) {
				boundPathX = -boundPathX;
			}

			this.boundingBullet.style.transition = `transform ${this.reboundSpeedCorrection /
				this.level.bulletSpeed * (reboundPath / this.bulletFirePath)}ms
			cubic-bezier(.12,.07,.29,.74)`;

			this.boundingBullet.style.transform = `translate3d(0,0,0) translate(${boundPathX}px,
				${boundPathY}px)`;
			this.boundingBullet.style.WebkitTransform = `translate3d(0,0,0) translate(${boundPathX}px,
				${boundPathY}px)`;

			this.boundingBullet.addEventListener('transitionend', this.boundingBullet.remove);
			this.boundedBullets++;
		}
	}

	/** TODO: utilites
	 * Преобразование градусов в радианы
	 *
	 * @param  {Number} angle in degrees
	 * @return {Number} angle in rads
	 * @private
	 */
	_degreesToRads(angle) {
		return angle * (Math.PI / 180);
	}

	/** TODO: utilites
	 * Скопировать элемент для рестарта анимации
	 *
	 * @private
	 */
	_replaceElement(el) {
		const copy = el.cloneNode(true);
		el.parentNode.replaceChild(copy, el);
		return copy;
	}

	/** TODO: utilites
	 * Найти CSS-правило для анимации
	 *
	 * @param {String} CSS rule name
	 * @private
	 */
	_getKeyframesRule(rule) {
		this._keyframes = [];
		const ss = document.styleSheets;
		for (let i = 0; i < ss.length; ++i) {
			for (let j = 0; j < ss[i].cssRules.length; ++j) {
				if (ss[i].cssRules[j].name === rule) {
					this._keyframes.push(ss[i].cssRules[j]);
				}
			}
		}
	}
}
