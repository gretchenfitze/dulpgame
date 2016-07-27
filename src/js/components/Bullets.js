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
			this.activeBullet.classList.add('bullet--active');
			this.activeBullet.color = this.activeBullet.style.backgroundColor;
			this.el.parentNode.insertBefore(this.activeBullet, this.el);
		}
	}

	// Движение пули для цикла игры
	update(delta) {
		this.fullPath = this.activeBullet.offsetTop - this.activeBullet.clientHeight -
			this.circle.offsetTop - this.circle.clientHeight;
		this.bulletPath += this.fullPath / delta * this.level.bulletSpeed;
		if (this.bulletPath >= this.fullPath) {
			this.bulletPath = this.fullPath;
			this.hit = true;
		}
		this.activeBullet.style.transform = `translate(-50%, -${this.bulletPath}px)`;
	}

	// Сброс настроек пуль после выстрела, присвоение новой пули статуса активной
	reset() {
		this.hit = false;
		this.activeBullet.remove();
		this.bulletPath = 0;
		this.activeBullet.style.transform = 'translate(-50%)';
		this.makeActiveBullet();
	}
}
