import Car from "./Car";
import Grid from "./Grid";
import Server from "./Server";

export default class AiAgent {
	public frontSensor = Infinity;
	public sideSensor = Infinity;

	public constructor(
		public readonly server: Server,
		public car: Car, public grid: Grid
	) {
		this.server = server;
		this.car = car;
		this.grid = grid;
	}

	public storeEntity(className: string) {
		// Calculate next gridItem from car
		let i = 0;
		let j = 0;
		this.server.grid[i][j].setObstacle(className);
		// set neighbor cells to obstacles
	}
}