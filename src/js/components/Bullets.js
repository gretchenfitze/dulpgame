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
		this.bulletPath = 0;
		this.hit = false;
		this._stepInterval = 1000 / 30;
		this.bulletSpeedCorrection = 15;
		this.reboundSpeedCorrection = 2;
		this.reboundPathCorrection = 4 / 3;
		this.boundAngleMin = 15;
		this.boundAngleMax = 40;
		this.timingFunction = 0;
		this.g = 9.80665 / (1000 * 1000);
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
		this.makeActiveBullet();
	}

	// Установка активной пули
	makeActiveBullet() {
		this.activeBullet = this.el.childNodes[0];
		if (this.activeBullet) {
			this.activeBullet.style.transform = 'translate(-50%)';
			this.activeBullet.style.transition = 'none';
			this.activeBullet.classList.add('game-screen__bullet--active');
			this.activeBulletColor = this.activeBullet.style.backgroundColor;
			this.el.parentNode.insertBefore(this.activeBullet, this.el);
		}
	}

	// Движение пули для цикла игры с учетом ускорения свободного падения
	update() {
		this.fullPath = this.activeBullet.offsetTop - this.activeBullet.clientHeight -
			this.circle.offsetTop - this.circle.clientHeight;
		this.bulletStep = this.fullPath * this.level.bulletSpeed / this.bulletSpeedCorrection;
		this.time = this.fullPath / this.bulletStep;
		this.finalSpeed = this.bulletStep - this.g * this.time;
		this.timingFunction += (this.bulletStep - this.finalSpeed) / this.time;
		this.bulletPath += this.bulletStep - this.timingFunction;

		if (this.bulletPath >= this.fullPath) {
			this.bulletPath = this.fullPath;
			this.hit = true;
		}
		this.activeBullet.style.transform = `translate(-${this.activeBullet.clientHeight / 2}px,
		-${this.bulletPath}px)`;
	}

	// Сброс настроек пуль после выстрела, присвоение новой пули статуса активной
	reset() {
		this.hit = false;
		this.bulletPath = 0;
		this.timingFunction = 0;
		this.makeActiveBullet();
		this.circle = document.querySelector('.js-circle');
	}

	// Возможность пули отлетать после удара в сторону кручения круга
	rebound() {
		this.boundingBullet = this.activeBullet;
		if (this.boundingBullet) {
			this.distanceFromCircleToBottom = document.documentElement.clientHeight -
				this.circle.offsetTop - this.circle.clientHeight;

			this.boundAngle = this._degreesToRads(this.boundAngleMin + Math.random() *
				(this.boundAngleMax - this.boundAngleMin));

			this.reboundPath = this.distanceFromCircleToBottom /
				Math.sin(this._degreesToRads(90) - this.boundAngle) * this.reboundPathCorrection;

			this.boundPathX = -this.reboundPath * Math.sin(this.boundAngle);
			this.boundPathY = this.reboundPath * Math.cos(this.boundAngle);

			if (this.level.circleSpeed < 0) {
				this.boundPathX = -this.boundPathX;
			}
			if ((this.level.reverse) && (this.boundedBullets % 2)) {
				this.boundPathX = -this.boundPathX;
			}

			this.boundingBullet.style.transition = `transform
			${this.reboundPath / (this.bulletStep / this._stepInterval) * this.reboundSpeedCorrection}ms
			cubic-bezier(.12,.07,.29,.74)`;

			this.boundingBullet.style.transform = `translate(${this.boundPathX}px,
				${this.boundPathY}px)`;

			this.boundingBullet.addEventListener('transitionend', this.boundingBullet.remove);
			this.boundedBullets++;
		}
	}

	/**
	 * Преобразование градусов в радианы
	 *
	 * @param  {Number} angle in degrees
	 * @return {Number} angle in rads
	 * @private
	 */
	_degreesToRads(angle) {
		return angle * (Math.PI / 180);
	}
}
