/**
 * @class Circle class
 */

export default class Circle {
	constructor(level) {
		this.level = level;
		this.el = document.querySelector('.js-circle');
		this.center = document.querySelector('.circle__center');
	}

	_getRotationDegs() {
		this._rotationDegs = [0];
		this._rotationDeg = 0;
		for (let i = 0; i < this.level.colorCount; i++) {
			this._rotationDeg += +this.level.colorSlice[i];
			this._rotationDegs.push(this._rotationDeg);
		}
	}

	_getScaleMetric() {
		this._scaleMetrics = [];
		for (let i = 0; i < this.level.colorCount; i++) {
			this._scale = this.level.colorSlice[i] <= 90 ? 1 : 10;
			this._scaleMetrics.push(this._scale);
		}
	}

	_spin(speed) {
		this.spinDegree = 0;
		setInterval(() => {
			this.el.style.transform = `rotate(${this.spinDegree}deg)`;
			this.spinDegree += 1;
			if (this.spinDegree === 360) {
				this.spinDegree = 0;
			}
		}, (50 - speed));
	}

	_showLevelNumber() {
		this.center.innerHTML = this.level.name;
	}

	renderSlices() {
		this._showLevelNumber();
		this._getRotationDegs();
		this._getScaleMetric();
		for (let i = 0; i < this.level.colorCount; i++) {
			const newSector = document.createElement('li');
			newSector.classList.add('circle__part');
			newSector.style.background = this.level.colors[i];
			newSector.style.transform = `
				rotate(${this._rotationDegs[i]}deg)
				skew(${90 - this.level.colorSlice[i]}deg)
				scale(${this._scaleMetrics[i]})
			`;
			this.el.appendChild(newSector);
		}
		this._spin(this.level.circleSpeed);
	}

	getHitSector(x, y) {
		this.hitSector = document.elementFromPoint(x, y);
		this.hitSectorColor = this.hitSector.style.backgroundColor;
	}

	deleteHitSector() {
		this.el.removeChild(this.hitSector);
	}
}
