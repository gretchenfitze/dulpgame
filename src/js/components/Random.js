import Utilities from './Utilities.js';

/**
 * @class Random class
 */
export default class Circle {
	constructor() {
		this.utils = new Utilities();
		this.minSliceDegree = 15;
		this.maxSliceDegree = 150;
		this.maxNumberOfSlices = 12;
		this.minSpeed = 1;
		this.maxSpeed = 5;
		this.minCircleSize = 20;
		this.maxCircleSize = 45;
	}
	// Создание круга для случайного уровня
	createRandomLevel() {
		this.colorSliceRandom = [];
		this._addRandomSlice();
		while (this._sumOfSlices() <= 360) {
			this._addRandomSlice();
		}
		this.colorSliceRandom.splice(-1, 1, this._lastSlice() - this._sumOfSlices() + 360);
		if (this._lastSlice() < this.minSliceDegree) {
			this.colorSliceRandom.splice(-2, 2);
			this.colorSliceRandom.push(360 - this._sumOfSlices());
		}

		if (this.colorSliceRandom.length > this.maxNumberOfSlices) {
			this.colorSliceRandom.splice(this.maxNumberOfSlices - 1,
				this.colorSliceRandom.length - this.maxNumberOfSlices + 1);
			this.colorSliceRandom.push(360 - this._sumOfSlices());
		}

		const randomSign = Math.random() < 0.5 ? -1 : 1;
		this.speedRandom = this.utils.randomize(this.minSpeed, this.maxSpeed) * randomSign;
		this.sizeRandom = this.utils.randomize(this.minCircleSize, this.maxCircleSize);
		this.reverseRandom = Math.random() < 0.5;
	}

	/**
	 * Добавление сектора для случайных уровней
	 *
	 * @private
	 * @return {Number}
	 */
	_addRandomSlice() {
		this.colorSliceRandom.push(this.utils.randomize(this.minSliceDegree, this.maxSliceDegree));
	}

	/**
	 * Определение размера последнего сектора для случайных уровней
	 *
	 * @private
	 * @return {Number}
	 */
	_lastSlice() {
		return this.colorSliceRandom[this.colorSliceRandom.length - 1];
	}

	/**
	 * Подсчет суммы секторов для случайных уровней
	 *
	 * @private
	 * @return {Number}
	 */
	_sumOfSlices() {
		return this.colorSliceRandom.reduce((slice1, slice2) => slice1 + slice2);
	}
}
