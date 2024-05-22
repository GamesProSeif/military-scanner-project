import { RawData } from "ws";
import BaseSocket from "./BaseSocket";
import Server, { MyWebSocket } from "../Server";
import { degreesToRadians, sleep } from "../../utils";

export default class ESPSocket extends BaseSocket {
	public interval: NodeJS.Timeout | null = null;

	public constructor(server: Server, ws: MyWebSocket) {
		super(server, "ESP", ws);
		this.ws.name = "ESP";
	}

	private sendDataRequest() {
		return this.send("d:?");
	}

	public sendMoveForwardRequest(distance: number | string) {
		return this.send(`f:${distance}`);
	} 

	public sendTurnRequest(angle: number | string) {
		return this.send(`t:${angle}`);
	} 

	public async start() {
		await this.send(`s:${this.server.car.x} ${this.server.car.y} ${this.server.car.angle}`);
		this.interval = setInterval(() => this.sendDataRequest(), 1000 / this.server.ESP_SEND_RATE);
		await sleep(5000);
		this.server.startAiAgent();
	}

	public onConnection() {
		super.onConnection();
		this.start();
	}

	public onMessage(data: RawData): void {
		const message = data.toString();

		if (message === "ack")
			this.server.car.unlock();
		else if (message.startsWith("d:"))
			this.parseData(message.slice(2));
	}

	private parseData(message: string) {
		const readings = message.toString().split(" ");
		const [x, y, angle, frontSensor, sideSensor] = readings.map(reading => parseFloat(reading));

		// this.server.car.x = x;
		// this.server.car.y = y;
		// this.server.car.angle = degreesToRadians(angle);
		this.server.aiAgent.frontSensor = frontSensor;
		this.server.aiAgent.sideSensor = sideSensor;
	}
}