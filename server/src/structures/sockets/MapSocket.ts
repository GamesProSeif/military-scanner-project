import { RawData } from "ws";
import BaseSocket from "./BaseSocket";
import Server, { MyWebSocket } from "../Server";

export default class MapSocket extends BaseSocket {
	public constructor(server: Server, ws: MyWebSocket) {
		super(server, "MAP", ws);
		this.ws.name = "MAP";
	}

	public onMessage(message: RawData): void {
		
	}
}