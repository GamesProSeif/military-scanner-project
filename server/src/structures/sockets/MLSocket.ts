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
		this.parseData(message.toString());
	}

	private parseData(message: string) {
		const match = message.match(/Predicted class: (\w+), Confidence: ([\d.]+)%/);
		if (!match)
			throw new TypeError(`Couldn't parse ML Data\tMessage: ${message}`);

		const className = match[1];
		const confidence = parseFloat(match[2]) / 100;

		if (confidence >= this.server.ML_THRESHOLD)
			this.server.aiAgent.storeEntity(className);
	}
}
