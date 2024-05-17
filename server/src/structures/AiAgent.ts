import GridItem from "./GridItem";
import Car from "./Car";
import Grid from "./Grid";
import Server from "./Server";

export default class AiAgent {
	public constructor(
		public readonly server: Server,
		public car: Car, public grid: Grid
	) {

	}
}