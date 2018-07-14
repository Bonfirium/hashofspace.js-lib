import BN from 'bignumber.js';
import sha256 from 'sha256';
import { IsNotIntegerNumberError } from './errors';

/** @type {Point[]} */
let d8;

/**
 * @param {BigNumber|String|Number} value
 * @return {BigNumber}
 * @throws {IsNotIntegerNumberError}
 */
const convertCoord = (value) => {
	if (BN.isBigNumber(value)) return value;
	if (['string', 'number'].includes(typeof value)) {
		const result = new BN(value);
		if (result.isInteger()) return result;
	}
	throw new IsNotIntegerNumberError(value);
};

export default class Point {
	/**
	 * params are:
	 * - x and y coordinates (as Number, BigNumber or String)
	 * - array with 2 elements (x and y as types below)
	 * - other Point (to clone)
	 * - string, contained x and y, separated by `:`
	 *
	 * @param {BigNumber|String|Number|Point|Array.<BigNumber|String|Number>} x
	 * @param {BigNumber|String|Number?} y
	 */
	constructor(x, y) {
		if (typeof y === 'undefined') {
			if (x instanceof Point) {
				this.x = x.x;
				this.y = x.y;
				return;
			}
			if (typeof x === 'string') {
				([this.x, this.y] = x.split(':'));
				return;
			}
			if (Array.isArray(x)) {
				([this.x, this.y] = x);
				return;
			}
		} else {
			this.x = x;
			this.y = y;
			return;
		}
		throw new Error('invalid Point constructor params');
	}

	/**
	 * @static
	 * @param {Point} point
	 * @return {Point}
	 */
	static clone(point) {
		return new Point(point);
	}

	/**
	 * @static
	 * @return {Point[]}
	 */
	static get d8() {
		return d8.map(point => point.clone());
	}

	/**
	 * @static
	 * @param {Number} direction number in range `[0-8)` (0 is right, 2 is top, and so on)
	 * @return {Point}
	 */
	static getD8(direction) {
		return d8[direction].clone();
	}

	/** @param {BigNumber|String|Number} value */
	set x(value) {
		this._x = convertCoord(value);
	}

	/** @param {BigNumber|String|Number} value */
	set y(value) {
		this._y = convertCoord(value);
	}

	/** @return {BigNumber} */
	get x() {
		return this._x.plus(0);
	}

	/** @return {BigNumber} */
	get y() {
		return this._y.plus(0);
	}

	/** @return {Point} */
	clone() {
		return new Point(this.x, this.y);
	}

	/** @param {String?} salt='point' */
	toString(salt) {
		return `${this.x.toString()}:${this.y.toString()}:${salt}`;
	}

	/** @param {String?} salt='point' */
	getHash(salt) {
		return sha256(this.toString(salt));
	}

	/**
	 * @param {Point} point
	 * @return {Point}
	 */
	move(point) {
		this.x = this.x.plus(point.x);
		this.y = this.y.plus(point.y);
		return this;
	}

	/**
	 * @param {Point} point
	 * @return {Point}
	 */
	plus(point) {
		return this.clone().move(point);
	}
}

d8 = [
	new Point(1, 0),
	new Point(1, -1),
	new Point(0, -1),
	new Point(-1, -1),
	new Point(-1, 0),
	new Point(-1, 1),
	new Point(0, 1),
	new Point(1, 1),
];
