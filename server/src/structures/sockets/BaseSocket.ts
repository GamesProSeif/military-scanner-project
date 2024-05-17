import { RawData } from "ws";
import Server, { MyWebSocket } from "../Server";

export default abstract class BaseSocket {
	public constructor(public readonly server: Server, public readonly name: string, protected readonly ws: MyWebSocket) {
		this.server = server;
		this.name = name;
		this.ws = ws;
	}

	public send(message: string): Promise<void> {
		return new Promise((res, rej) => {
			this.ws.send(message, err => {
				if (err)
					rej(err);
				else
					res();
			});
		});
	}

	public abstract onMessage(message: RawData): void;

	public onConnection() {
		console.log(`DEBUG: ${this.name} connected`);
	};

	public onClose(code: number, reason: Buffer) {
		console.log("DEBUG: ws close - client:", this.name, "code:", code, "reason:", reason.toString());
	}

	public static parseMessage(message: RawData) {
		const messageSplit = message.toString().split(":");
		const messageType = messageSplit[0];
		const args = messageSplit.slice(1).join(":").split(",");

		return { messageType, args };
	}
}