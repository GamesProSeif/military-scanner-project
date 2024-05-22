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
			for (let j = 0; j < dimensions; j++)
				tempArr[i][j] = new GridItem(i, j);
		}

		super(...tempArr);

		this.dimensions = dimensions;
		this.size = areaSize;
	}

	public forGrid(fn: (g: GridItem) => void) {
		for (let i = 0; i < this.dimensions; i++)
			for (let j = 0; j < this.dimensions; j++)
				fn(this[i][j]);
	}

	public getIndex(x: number, y: number): [number, number] {
		return [
			Math.floor(x / this.size),
			Math.floor(y / this.size)
		];
	}

	public floodFill(x: number, y: number, oldColor: ObstacleType, newColor: ObstacleType, setDiscovered: boolean = false) {
		const grid = this[x][y];
		if (x < 0 || x >= this.dimensions || y < 0 || y >= this.dimensions)
			return;
		if (grid.obstacle !== oldColor)
			return;

		grid.obstacle = newColor;

		if (setDiscovered)
			grid.discovered = true;

		this.floodFill(x - 1, y, oldColor, newColor);
		this.floodFill(x + 1, y, oldColor, newColor);
		this.floodFill(x, y - 1, oldColor, newColor);
		this.floodFill(x, y + 1, oldColor, newColor);
	}

	public findContour(
		x: number, y: number, color: number, contour: GridItem[],
		visited?: [number, number][]
	) {
		if (x < 0 || x >= this.dimensions || y < 0 || y >= this.dimensions)
			return;
		if (!visited)
			visited = [];
		if (visited.some(g => g[0] === x && g[1] === y))
			return;
		visited.push([x, y]);
		const grid = this[x][y];
		if (grid.discovered && grid.obstacle === color) {
			this.findContour(grid.x - 1, grid.y, color, contour, visited);
			this.findContour(grid.x - 1, grid.y, color, contour, visited);
			this.findContour(grid.x, grid.y - 1, color, contour, visited);
			this.findContour(grid.x, grid.y + 1, color, contour, visited);
		} else
			return contour.push(grid);
	}

	public fillGrid() {
		this.floodFill(0, 0, 0, 1, true);
	}

	public findInnerPath() {
		let grid: GridItem;

		for (let i = 0; i < this.dimensions; i++)
			for (let j = 0; j < this.dimensions; j++)
				if (this[i][j].obstacle === 0 && this[i][j].discovered) {
					grid = this[i][j];
					break;
				}

		let contour: GridItem[] = [];

		this.findContour(grid!.x, grid!.y, 0, contour);

		contour = contour.filter(g => g.obstacle !== 1);
		return contour;
	}

	public coordinatesToIndex(x: number, y: number) {
		x = Math.round(x);
		y = Math.round(y);

		let i = x - x % this.size;
		let j = y - y % this.size;

		return [i, j];
	}
}
