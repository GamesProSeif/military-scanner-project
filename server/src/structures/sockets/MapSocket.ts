import { RawData } from "ws";
import BaseSocket from "./BaseSocket";
import Server, { MyWebSocket } from "../Server";

export default class MapSocket extends BaseSocket {
	public interval: NodeJS.Timeout | null = null;

	public constructor(server: Server, ws: MyWebSocket) {
		super(server, "MAP", ws);
		this.ws.name = "MAP";
	}

	public onMessage(message: RawData): void {
		
	}

	public sendData() {
		const message = {
			car: {
				x: this.server.car.x,
				y: this.server.car.y,
				angle: this.server.car.angle
			},
			frontSensor: this.server.aiAgent.frontSensor,
			sideSensor: this.server.aiAgent.sideSensor,
			grid: this.server.grid.map(row => row.map(g => g.encoded))
		}

		this.send(JSON.stringify(message));
	}

	public start() {
		this.send(`s:${this.server.grid.dimensions} ${this.server.grid.size}`);
		this.interval = setInterval(() => this.sendData(), 1000 / this.server.MAP_SEND_RATE);
	}

	public onConnection(): void {
		super.onConnection();
		this.start();
	}

	public onClose(code: number, reason: Buffer): void {
		super.onClose(code, reason);
		if (this.interval)
			clearInterval(this.interval);
	}
}