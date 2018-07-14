import BN from 'bignumber.js';
import { Point } from '../tools';

/** @param {Point} point */
export function getCell(point) {
	const salt = 'universe-testnet';
	const selfHash = point.getHash(salt);
	const hashAsBN = new BN(`0x${selfHash}`);
	const d8 = Point.d8;
	for (const dir of d8) {
		const nearPoint = point.plus(dir);
		const hash = new BN(`0x${nearPoint.getHash(salt)}`);
		if (hash.gte(hashAsBN)) {
			if (!hash.eq(hashAsBN) || point.x.gt(nearPoint.x) || point.y.gt(nearPoint.y)) {
				return { hash: selfHash, hasSystem: false };
			}
		}
	}
	return { hash: selfHash, hasSystem: true };
}
