import { radiansToDegrees, sleep } from "../utils";
import Server from "./Server";

export default class Car {
	public deltaAngle = 0;
	private lock = false;

	public constructor(
		public readonly server: Server,
		public x: number, public y: number, public angle: number
	) {
		this.server = server;
		this.x = x;
		this.y = y;
		this.angle = angle;
	}

	public moveForward(distance: number): Promise<void> | null {
		if (this.lock)
			return null;

		this.lock = true;

		return new Promise(async (res, rej) => {
			await this.server.espSocket.sendMoveForwardRequest(distance / 100);

			for (let i = 0; i < 3; i++) {
				await sleep(1000);
				if (this.lock === false) {
					// update x and y coordinates
					this.x += (distance * Math.cos(this.angle));
					this.y += (distance * Math.sin(this.angle));
					return res();
				}
			}

			return rej("Server did not respond to moveForward request");
		});
	}

	public turn(angle: number): Promise<void> | null {
		if (this.lock)
			return null;

		this.lock = true;

		return new Promise(async (res, rej) => {
			await this.server.espSocket.sendTurnRequest(Math.round(radiansToDegrees(angle)));

			for (let i = 0; i < 3; i++) {
				await sleep(2000);
				if (this.lock === false) {
					this.angle += angle;
					this.deltaAngle += angle;
					return res();
				}
			}

			return rej("Server did not respond to turn request");
		});
	}

	public async goTo(x: number, y: number) {
		let dx = x - this.x;
		let dy = y - this.y;
		const distance = dx * dx + dy * dy;

		const targetAngle = Math.atan2(dy, dx);
		let angleDiff = targetAngle - this.angle;

		angleDiff = (angleDiff + Math.PI) % (2 * Math.PI) - Math.PI;

		await this.turn(angleDiff);
		await this.moveForward(distance);

		// while (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
		// 	const distance = Math.sqrt(dx * dx + dy * dy);
		// 	await this.moveForward(distance);

		// 	dx = x - this.x;
		// 	dy = y - this.y;
		// }
	}

	public unlock() {
		this.lock = false;
	}

	public startDeltaAngle() {
		this.deltaAngle = 0;
	}
}