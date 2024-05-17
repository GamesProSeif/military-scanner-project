import Server from "./Server";

export default class Car {
	public length = 30;
	public width = 20;

	public constructor(
		public readonly server: Server,
		public x: number, public y: number, public angle: number
	) {
		this.server = server;
		this.x = x;
		this.y = y;
		this.angle = angle;
	}
}