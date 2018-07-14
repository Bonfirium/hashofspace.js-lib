export default class IsNotIntegerNumberError extends Error {
	constructor(value) {
		super();
		this.message = 'value is not integer number';
		this.name = this.constructor.name;
		this.value = value;
	}
}
