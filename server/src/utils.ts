export function sleep(ms: number): Promise<void> {
	return new Promise(res => setTimeout(() => res(), ms));
}

export function radiansToDegrees(angle: number) {
	return angle * 180 / Math.PI;
}

export function degreesToRadians(angle: number) {
	return angle * Math.PI / 180;
}

export function dist(x1: number, y1: number, x2: number, y2: number) {
	const dx = (x2 - x1) ** 2;
	const dy = (y2 - y1) ** 2;

	return Math.sqrt(dx + dy);
}
