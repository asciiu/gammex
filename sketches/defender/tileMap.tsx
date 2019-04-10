
export class Tile { 
    isBlocked: boolean
    isOccupied: boolean
    col: number 
    row: number

    constructor(col: number, row: number) {
        this.isBlocked = false;
        this.isOccupied = false;
        this.col = col;
        this.row = row;
    }

	// SETTERS 
	reset = () => {
		this.isBlocked = false;
		this.isOccupied = false;
	}
}

export class TileMap { 
    //this._astar = undefined;
    numCols: number
    numRows: number
    tileSize: number 
    tiles: Array<Tile> = [];
    emptyTiles: Array<Tile> = [];

    constructor(cols: number, rows: number, tileSize: number) {
        this.numCols = cols;
        this.numRows = rows;
        this.tileSize = tileSize;

        for (let c = 0; c < cols; ++c) {
            for (let r = 0; r < rows; ++r) {
                this.tiles.push(new Tile(c, r))
            }
        }
    }
}
