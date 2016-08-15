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
		this.spinDegree = 0;
		this.circleSpeed = +this.level.name % 2 ?
		+this.level.circleSpeed : 0 - this.level.circleSpeed;
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
	}

	// Кручение круга для цикла игры
	update() {
		this.spinDegree += this.circleSpeed;
		if (this.spinDegree >= 360 || this.spinDegree <= -360) {
			this.spinDegree = 0;
		}
		this.el.style.transform = `rotate(${this.spinDegree}deg)`;
	}
}
