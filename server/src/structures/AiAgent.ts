import { dist } from "../utils";
import Server from "./Server";

export type AI_AGENT_STATE = 1 | 2 | 3 | 4 | 5 | 6;

export default class AiAgent {
	private ULTRASONIC_RANGE = 150;
	public frontSensor = Infinity;
	public sideSensor = Infinity;

	private frontScanning = false;
	private sideScanning = false;
	private idle = true;
	private tempPos: { x: number, y: number } | null = null;

	private _state: AI_AGENT_STATE = 1;

	public get state() {
		return this._state;
	}

	private set state(value: AI_AGENT_STATE) {
		this._state = value;
	}

	public get car() {
		return this.server.car;
	}

	public get grid() {
		return this.server.grid;
	}

	public constructor(
		public readonly server: Server,
	) {
		this.server = server;
	}

	public storeEntity(className: string) {
		// Calculate next gridItem from car
		const FRONT_DISTANCE = 2; // number of grids away from car
		let i = this.car.x + FRONT_DISTANCE * this.grid.size * Math.cos(this.car.angle);
		let j = this.car.y + FRONT_DISTANCE * this.grid.size * Math.sin(this.car.angle);

		[i, j] = this.grid.coordinatesToIndex(i, j);

		this.server.grid[i][j].setObstacle(className);
	}

	private scan(sensor: "front" | "side") {
		const angle = sensor === "front" ? 0 : Math.PI / 2;
		const distance = sensor === "front" ? this.frontSensor : this.sideSensor;

		for (let i = 0; i <= distance; i++) {
			let x = this.car.x + i * Math.cos(angle - this.car.angle);
			let y = this.car.y + i * Math.sin(angle - this.car.angle);

			[x, y] = this.grid.coordinatesToIndex(x, y);
			const grid = this.grid[x][y];
			grid.discovered = true;

			if (distance < this.ULTRASONIC_RANGE && i === Math.floor(distance))
				grid.obstacle = 1;
		}
	}

	public async run() {
		if (this.frontScanning) {
			this.scan("front");
		}

		if (this.sideScanning) {
			this.scan("side");
		}

		if (!this.idle)
			return;
		this.idle = false;

		switch (this.state) {
			case 1:
				if (this.sideSensor < this.ULTRASONIC_RANGE) {
					await this.sideFaceWall();
					this.sideScanning = true;
					this.state = 3;
					this.car.startDeltaAngle();
					this.tempPos = { x: this.car.x, y: this.car.y };
				} else if (this.frontSensor < this.ULTRASONIC_RANGE)
					this.state = 2;
				else
					await this.car.moveForward(20);
				break;

			case 2:
				const distance1 = this.sideSensor;
				await this.car.turn(0.01);
				const distance2 = this.sideSensor;

				if (distance2 > distance1) {
					this.sideScanning = true;
					this.state = 3;
				}
				this.car.startDeltaAngle();
				this.tempPos = { x: this.car.x, y: this.car.y };
				break;

			case 3:
				if (this.frontSensor < this.ULTRASONIC_RANGE) {
					await this.car.turn(Math.PI / 2);
					await this.sideFaceWall();
					this.sideScanning = true;
					this.state = 3;
				}

				const sideDistance = this.sideSensor;

				if (sideDistance > this.ULTRASONIC_RANGE)
					await this.car.turn(-Math.PI / 4);
				else if (sideDistance > this.ULTRASONIC_RANGE * 0.7)
					await this.car.turn(-0.1);
				else if (sideDistance < this.ULTRASONIC_RANGE * 0.2)
					await this.car.turn(0.2);
				else if (sideDistance < this.ULTRASONIC_RANGE * 0.3)
					await this.car.turn(0.1);

				await this.car.moveForward(40);

				const distance = dist(this.car.x, this.car.y, this.tempPos!.x, this.tempPos!.y);

				if (distance < 30)
					this.state = 4;
				break;

			case 4:
				if (this.car.deltaAngle <= -5)
					this.state = 5;
				else if (this.car.deltaAngle >= 5) {
					this.grid.fillGrid();
					const contour = this.grid.findInnerPath();
					let closestPixel = contour[0];
					let closestDistance = Infinity;
					for (const c of contour) {
						const distance = dist(this.car.x, this.car.y, c.x, c.y);
						if (distance < closestDistance) {
							closestDistance = distance;
							closestPixel = c;
						}
					}

					this.sideScanning = false;
					await this.car.goTo(closestPixel.x, closestPixel.y);
					this.state = 6;
				}
				break;

			case 5:
				await this.car.turn(Math.PI / 2);
				this.sideScanning = false;
				this.state = 1;
			case 6:
				break;
			default:
				break;
		}

		this.idle = true;
	}

	private async sideFaceWall() {
		let distance1 = this.sideSensor;
		await this.server.car.turn(0.01);
		let distance2 = this.sideSensor;

		const direction = distance2 < distance1 ? 1 : -1;

		while (true) {
			distance1 = this.sideSensor;
			await this.server.car.turn(0.1 * direction);
			distance2 = this.sideSensor;

			if (distance1 < distance2)
				break;

			// if (
			// 	direction === 1 && distance1 < distance2
			// 	|| direction === -1 && distance1 > distance2
			// )
			// break;
		}
	}
}