import { getCell } from './generators/universe';
import { Point } from './tools';

for (let y = 0; y < 50; y++) {
	let row = '';
	for (let x = 0; x < 50; x++) {
		row += getCell(new Point(x, y)).hasSystem ? '#' : ' ';
	}
	console.log(row);
}
