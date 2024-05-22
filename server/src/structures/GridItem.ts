export type ObstacleType
	= 0		// free space
	| 1		// hard obstacle
	| 2		// soldier
	| 3		// tank
	| 4;	// camp

export default class GridItem {
	public obstacle: ObstacleType

	public constructor(
		public x: number,
		public y: number,
		public discovered = false,
		obstacle: ObstacleType = 0
	) {
		this.x = x;
		this.y = y;
		this.discovered = discovered;
		this.obstacle = obstacle;
	}

	/**
	 * @returns string - encoded format of grid
	 */
	get encoded() {
		return [this.discovered ? 1 : 0, this.obstacle];
	}

	public setObstacle(className: string) {
		switch (className) {
			case "soldier":
				this.obstacle = 2;
				break;
			case "tank":
				this.obstacle = 2;
				break;
			case "camp":
				this.obstacle = 3;
				break;
		}
	}
}
