
export class Tile { 
    isBlocked: boolean
    isOccupied: boolean
    col: number 
    row: number
    shape: any

    constructor(col: number, row: number) {
        this.isBlocked = false;
        this.isOccupied = false;
        this.col = col;
        this.row = row;
    }

    getIndex = () => {
        return {xPos: this.col, yPos: this.row};
    }

    setBlocked = () => { this.isBlocked = true }
    setOccupied = (occupied: boolean) => { this.isOccupied = occupied }
    setShape = (shape: any) => { this.shape = shape }

	// CHECKERS 
	// isBlocked = () => { return this.isBlocked; };
    // isOccupied = () => { return this.isOccupied; };

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
    tiles: Tile[][] = [];
    emptyTiles: Tile[][] = [];

    constructor(cols: number, rows: number, tileSize: number) {
        this.numCols = cols;
        this.numRows = rows;
        this.tileSize = tileSize;

        for (let x = 0; x < cols; ++x) {
            let col: Tile[] = [];
            for (let y = 0; y < rows; ++y) {
                let tile = new Tile(x, y);
                if (x == 3 && y > 0 ) {
                    tile.isOccupied = true;
                } else {
                    tile.isOccupied = false;
                }

                col.push(tile);
            }
            this.tiles.push(col);
        }
    }
}
