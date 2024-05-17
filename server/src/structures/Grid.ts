import GridItem, { ObstacleType } from "./GridItem";

export default class Grid extends Array<Array<GridItem>> {
	public dimensions: number;		// dimensions of 2D array
	public readonly size: number;	// size of single grid item

	public constructor() {
		const dimensions = 100;
		const areaSize = 30;

		const tempArr: GridItem[][] = [];

		for (let i = 0; i < dimensions; i++) {
			tempArr[i] = [];
			for (let j = 0; i < dimensions; i++)
				tempArr[i][j] = new GridItem(i, j);
		}

		super(...tempArr);

		this.dimensions = dimensions;
		this.size = areaSize;
	}

	public getIndex(x: number, y: number): [number, number] {
		return [
			Math.floor(x / this.size),
			Math.floor(y / this.size)
		];
	}

	public floodFill(x: number, y: number, oldColor: ObstacleType, newColor: ObstacleType) {
		const grid = this[x][y];
		if (x < 0 || x >= this.dimensions || y < 0 || y >= this.dimensions)
			return;
		if (grid.obstacle !== oldColor)
			return;

		grid.obstacle = newColor;

		this.floodFill(x - 1, y, oldColor, newColor);
		this.floodFill(x + 1, y, oldColor, newColor);
		this.floodFill(x, y - 1, oldColor, newColor);
		this.floodFill(x, y + 1, oldColor, newColor);
	}
}
