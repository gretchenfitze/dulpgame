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
	}

	/**
	 * Получение значений для растяжения секторов
	 * Если сектор больше 90 градусов, для корректного отражения создается его дубликат
	 *
	 * @private
	 */
	_getSkewMetric() {
		this._skewMetrics = [];
		for (let i = 0; i < this.colorSlice.length; i++) {
			if (this.colorSlice[i] <= 90) {
				this._skew = 89 - this.colorSlice[i];
			} else {
				this.colorSlice[i] = this.colorSlice[i] / 2;
				this.colorSlice.splice(i, 0, this.colorSlice[i]);
				this.circleColors.splice(i, 0, this.circleColors[i]);
				i--;
			}
			this._skewMetrics.push(this._skew);
		}
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
	 * Отображение номер уровня в центре круга
	 *
	 * @private
	 */
	_showLevelNumber() {
		this.center.innerHTML = this.level.name;
	}

	// Прорисовка секторов круга
	renderSlices() {
		this._showLevelNumber();
		this._getSkewMetric();
		this._getRotationDegs();
		for (let i = 0; i < this.circleColors.length; i++) {
			const newSector = document.createElement('li');
			newSector.classList.add('circle__part');
			newSector.style.background = this.circleColors[i];
			newSector.style.transform = `
				rotate(${this._rotationDegs[i]}deg)
				skew(${this._skewMetrics[i]}deg)
			`;
			this.el.appendChild(newSector);
		}
	}

	// Получение цвета сектора, находящегося в нижней точке круга
	getHitSector() {
		this.x = Math.max(document.documentElement.clientWidth,
			window.innerWidth || 0) / 2;
		this.y = this.el.parentNode.offsetTop + this.el.clientHeight - 1;
		this.hitSector = document.elementFromPoint(this.x, this.y);
		this.hitSectorColor = this.hitSector.style.backgroundColor;
	}

	// Удаление сектора при попадании
	deleteHitSector() {
		this.hitSector.remove();
	}

	// Кручение круга для цикла игры
	update(delta) {
		this.spinDegree += delta / 25 * this.level.circleSpeed;
		if (this.spinDegree >= 360) {
			this.spinDegree = 0;
		}
		this.el.style.transform = `rotate(${this.spinDegree}deg)`;
		this.getHitSector();
	}
}
