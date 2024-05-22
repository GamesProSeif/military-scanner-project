import { RawData, WebSocket, WebSocketServer } from "ws";
import BaseSocket from "./sockets/BaseSocket";
import ESPSocket from "./sockets/ESPSocket";
import MapSocket from "./sockets/MapSocket";
import MLSocket from "./sockets/MLSocket";
import Car from "./Car";
import AiAgent from "./AiAgent";
import Grid from "./Grid";

export interface MyWebSocket extends WebSocket {
	name: "ML" | "MAP" | "ESP";
}

export default class Server {
	public readonly PORT = 8080;
	public readonly CLIENTS_SIZE = 3;
	public readonly ML_RECEIVE_RATE = 1;	// per second
	public readonly ESP_SEND_RATE = 1;		// per second
	public readonly MAP_SEND_RATE = 1;		// per second
	public readonly ML_THRESHOLD = 0.85;

	private wss!: WebSocketServer;
	public mlSocket!: MLSocket;
	public mapSocket!: MapSocket;
	public espSocket!: ESPSocket;
	public car = new Car(this, 500, 500, 0);
	public grid = new Grid();
	public aiAgent = new AiAgent(this);

	public start() {
		this.wss = new WebSocketServer({ port: this.PORT });
		console.log("DEBUG: Server started...");

		this.wss.on("connection", (ws: MyWebSocket, req) => {
			console.log(`DEBUG: new connection - ${req.socket.remoteAddress}`);
			if (this.wss.clients.size >= 3) {
				console.log("DEBUG: dropping connection - exceeded client size");
				ws.close(1, "maximum client size reached");
				return;
			}

			ws.on("message", message => this.handleMessage(ws, message));

			ws.send("a:?", err => err ? console.error("error sending auth request", err) : null);

			ws.on("close", (code, reason) => this.handleClose(ws, code, reason));
		});
	}

	public startAiAgent() {
		setInterval(() => this.aiAgent.run(), 50);
	}

	private handleMessage(ws: MyWebSocket, message: RawData) {
		console.log("DEBUG: MESSAGE ->", message.toString());

		const { messageType, args } = BaseSocket.parseMessage(message);

		if (messageType === "a") { // auth
			let newSocket: BaseSocket | undefined;
			switch (parseInt(args[0])) {
				case 0:
					this.mlSocket = new MLSocket(this, ws);
					newSocket = this.mlSocket;
					break;
				case 1:
					this.mapSocket = new MapSocket(this, ws);
					newSocket = this.mapSocket;
					break;
				case 2:
					this.espSocket = new ESPSocket(this, ws);
					newSocket = this.espSocket;
					break;
				default:
					console.error("Unknown auth code:", args[0]);
					break;
			}
			if (newSocket)
				newSocket.onConnection();
		} else {
			switch (ws.name) {
				case "ML":
					this.mlSocket.onMessage(message);
					break;
				case "MAP":
					this.mapSocket.onMessage(message);
					break;
				case "ESP":
					this.espSocket.onMessage(message);
					break;
			}
		}
	}

	private handleClose(ws: MyWebSocket, code: number, reason: Buffer) {
		switch (ws.name) {
			case "ML":
				this.mlSocket.onClose(code, reason);
				break;
			case "MAP":
				this.mapSocket.onClose(code, reason);
				break;
			case "ESP":
				this.espSocket.onClose(code, reason);
				break;
		}
	}

	public close() {
		this.wss.clients.forEach(client => client.close(1000, "end of session"));
	}
}
