/**
 * @class Circle class
 */
export default class Circle {
	constructor(level) {
		this.level = level;
		this.el = document.querySelector('.js-circle');
		this.center = document.querySelector('.circle__center');
		this.spinDegree = 0;
	}

	// Получение значений для размера секторов круга
	_getRotationDegs() {
		this._rotationDegs = [0];
		this._rotationDeg = 0;
		for (let i = 0; i < this.level.colors.length; i++) {
			this._rotationDeg += +this.level.colorSlice[i];
			this._rotationDegs.push(this._rotationDeg);
		}
	}

	// Если сектор больше 90 градусов, то для корректного отражения он увеличивается в 10 раз
	_getScaleMetric() {
		this._scaleMetrics = [];
		for (let i = 0; i < this.level.colors.length; i++) {
			this._scale = this.level.colorSlice[i] <= 90 ? 1 : 10;
			this._scaleMetrics.push(this._scale);
		}
	}

	// Отображение номер уровня в центре круга
	_showLevelNumber() {
		this.center.innerHTML = this.level.name;
	}

	// Прорисовка секторов круга
	renderSlices() {
		this._showLevelNumber();
		this._getRotationDegs();
		this._getScaleMetric();
		for (let i = 0; i < this.level.colors.length; i++) {
			const newSector = document.createElement('li');
			newSector.classList.add('circle__part');
			newSector.style.background = this.level.colors[i];
			newSector.style.transform = `
				rotate(${this._rotationDegs[i]}deg)
				skew(${90 - this.level.colorSlice[i] - 1}deg)
				scale(${this._scaleMetrics[i]})
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
		this.el.removeChild(this.hitSector);
	}

	// Кручение круга для цикла игры
	update(delta) {
		this.spinDegree += delta / 50 * this.level.circleSpeed;
		if (this.spinDegree >= 360) {
			this.spinDegree = 0;
		}
		this.el.style.transform = `rotate(${this.spinDegree}deg)`;
		this.getHitSector();
	}
}
