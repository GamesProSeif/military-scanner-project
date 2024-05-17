import { RawData } from "ws";
import BaseSocket from "./BaseSocket";
import Server, { MyWebSocket } from "../Server";

export default class MLSocket extends BaseSocket {
	public constructor(server: Server, ws: MyWebSocket) {
		super(server, "ML", ws);
		this.ws.name = "ML";
	}

	public async onConnection() {
		super.onConnection();
		await this.send(`r:${this.server.ML_RECEIVE_RATE}`);
	}

	public async onMessage(message: RawData) {
		const detectedObjects = [];
		for (const line of message.toString().split("\n")) {
			const [objectName, score, xmin, ymin, xmax, ymax] = line.split(" ");
			detectedObjects.push({ objectName, score, xmin, ymin, xmax, ymax });
		}
	}
}
