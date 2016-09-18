import Utilities from './Utilities.js';

/**
 * @class Random class
 */
export default class RandomLevel {
	constructor() {
		this.utils = new Utilities();
		this.minSliceDegree = 15;
		this.maxSliceDegree = 150;
		this.maxNumberOfSlices = 12;
		this.minSpeed = 1;
		this.maxSpeed = 5;
		this.minCircleSize = 20;
		this.maxCircleSize = 45;
		this._create();
	}

	/**
	 * Создание параметров для случайного уровня
	 *
	 * @private
	 */
	_create() {
		this.colorSlice = [];
		this._addRandomSlice();
		while (this._sumOfSlices() <= 360) {
			this._addRandomSlice();
		}
		this.colorSlice.splice(-1, 1, this._lastSlice() - this._sumOfSlices() + 360);
		if (this._lastSlice() < this.minSliceDegree) {
			this.colorSlice.splice(-2, 2);
			this.colorSlice.push(360 - this._sumOfSlices());
		}

		if (this.colorSlice.length > this.maxNumberOfSlices) {
			this.colorSlice.splice(this.maxNumberOfSlices - 1,
				this.colorSlice.length - this.maxNumberOfSlices + 1);
			this.colorSlice.push(360 - this._sumOfSlices());
		}

		const randomSign = Math.random() < 0.5 ? -1 : 1;
		this.speed = this.utils.randomize(this.minSpeed, this.maxSpeed) * randomSign;
		this.size = this.utils.randomize(this.minCircleSize, this.maxCircleSize);
		this.reverse = Math.random() < 0.5;
	}

	/**
	 * Добавление сектора для случайных уровней
	 *
	 * @private
	 * @return {Number}
	 */
	_addRandomSlice() {
		this.colorSlice.push(this.utils.randomize(this.minSliceDegree, this.maxSliceDegree));
	}

	/**
	 * Определение размера последнего сектора для случайных уровней
	 *
	 * @private
	 * @return {Number}
	 */
	_lastSlice() {
		return this.colorSlice[this.colorSlice.length - 1];
	}

	/**
	 * Подсчет суммы секторов для случайных уровней
	 *
	 * @private
	 * @return {Number}
	 */
	_sumOfSlices() {
		return this.colorSlice.reduce((slice1, slice2) => slice1 + slice2);
	}
}
