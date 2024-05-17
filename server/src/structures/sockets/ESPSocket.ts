import { RawData } from "ws";
import BaseSocket from "./BaseSocket";
import Server, { MyWebSocket } from "../Server";

export default class ESPSocket extends BaseSocket {
	public constructor(server: Server, ws: MyWebSocket) {
		super(server, "ESP", ws);
		this.ws.name = "ESP";
	}

	public async onConnection() {
		super.onConnection();
		await this.send(`r:${this.server.ESP_RECEIVE_RATE}`);
	}

	public onMessage(message: RawData): void {
		
	}
}