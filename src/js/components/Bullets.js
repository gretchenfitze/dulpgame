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
		this.rotatingCircle = document.querySelector('.js-circle');
		this.bulletPath = 0;
		this.hit = false;
		this._stepInterval = 1000 / 60;
		this.bulletSpeedCorrection = 30;
		this.boundAngle = 30;
		this.timingFunction = 0;
		this.g = 9.80665 / (1000 * 1000);
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

	// Отрисовка пуль
	renderBullets() {
		const li = document.createElement('li');
		li.classList.add('bullet');
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
			this.activeBullet.classList.add('bullet--active');
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
	}

	// Возможность пули отлетать после удара в сторону кручения круга
	rebound() {
		this.boundingBullet = this.activeBullet;
		if (this.boundingBullet) {
			this.circleStep = Math.PI * this.rotatingCircle.clientWidth / 2 *
				this.level.circleSpeed / 180;

			this.fromCircleToBottom = document.documentElement.clientHeight -
				this.boundingBullet.offsetTop + this.fullPath;

			this.reboundPath = this.fromCircleToBottom /
				Math.sin(this._degreesToRads(90 - this.boundAngle));
			this.boundPathX = this.reboundPath * Math.sin(this._degreesToRads(this.boundAngle));
			this.boundPathY = this.reboundPath * Math.cos(this._degreesToRads(this.boundAngle))
				- this.fullPath;

			this.boundPathEveryMs = this._rootSumOfSquares(this.circleStep, this.bulletStep)
				/ this._stepInterval;

			this.boundingBullet.style.transition =
				`transform ${this.reboundPath / this.boundPathEveryMs}ms`;

			this.boundingBullet.style.transform = +this.level.name % 2 ?
				`translate(-${this.boundPathX}px,
				${this.boundPathY}px)` :
				`translate(${this.boundPathX}px,
				${this.boundPathY}px)`;

			this.boundingBullet.addEventListener('transitionend', this.boundingBullet.remove);
		}
	}

	/**
	 * Вычисление квадратного корня из суммы квадратов
	 *
	 * @param  {Number} a первое число
	 * @param  {Number} b второе число
	 * @return {Number}
	 */
	_rootSumOfSquares(a, b) {
		return Math.sqrt(a * a + b * b);
	}

	/**
	 * Преобразование градусов в радианы
	 *
	 * @param  {Number} angle in degrees
	 * @return {Number} angle in rads
	 */
	_degreesToRads(angle) {
		return angle * (Math.PI / 180);
	}
}
