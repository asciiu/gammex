
export class Astar {
    constructor(sourceGrid) {
        this._sourceGrid = sourceGrid;
        this._width = sourceGrid.length;
        this._height = sourceGrid[0].length;
        this._limit = this._width * this._height;
        this._wrap = false;
        
        this._grid = [];
        for (let z = 0; z < this._height; z++) {
            for (let x = 0; x < this._width; x++) {
                this._grid.push({
                    parent: null,
                    value: z * this._width + x,
                    x: x,
                    z: z,
                    t: 0
                });
            }
        }

        this._neighborList = [];
        for (let n = 0; n < 8; n++) {
            this._neighborList.push({x: 0, z: 0});
        }

        this._t = 1;
    }

    _valid = (x, z) => {
        return !this._sourceGrid[x][z].isOccupied;
    };

    _tile = (index) => {
        var tile = this._grid[index],
            t = this._t;

        if (tile.t < t) {
            tile.f = 0;
            tile.g = 0;
            tile.t = t;
        }

        return tile;
    }
    
    _findPath = (startX, startZ, endX, endZ, adjacentOnly) => {
        let result = [];
        let grid = this._grid;
        let path = [];
        let width = this._width;
        let end = this._tile(endZ * width + endX);
        let open = [startZ * width + startX];
        let node;
        let currentNode;
        let length;
        let max, min, i;

        this._t++;

        while (open.length > 0) {
            length = open.length
            max = this._limit;
            min = -1;
            for (i = 0; i < length; i++) {
                if (grid[open[i]].f < max) {
                    max = grid[open[i]].f;
                    min = i;
                }
            };

            node = this._tile(open.splice(min, 1)[0]);
            if (node.value == end.value) {
                currentNode = node;
                while (!((currentNode.x == startX) && (currentNode.z == startZ))) {
                    result.push([currentNode.x, currentNode.z]);
                    currentNode = currentNode.parent;
                };
            } else {
                let neighbors = this._neighbors(node.x, node.z, adjacentOnly);
                for (let neighbor of neighbors) {
                    currentNode = this._tile(neighbor.z * width + neighbor.x);
                    if (!path[currentNode.value]) {
                        path[currentNode.value] = true;
                        currentNode.parent = node;
                        currentNode.g = this._manhattan(neighbor, node) + node.g;
                        currentNode.f = this._manhattan(neighbor, end) + currentNode.g;
                        open.push(currentNode.value);
                    }
                }
            };
        };

        return result;
    }

    findPath = (tile1, tile2, adjacentOnly, canOccupyStartAndEnd) => { 
	    var startX = tile1.col;
	    var startZ = tile1.row;
	    var endX = tile2.col;
        var endZ = tile2.row;

        var o1 = this._sourceGrid[startX][startZ].isOccupied;
        var o2 = this._sourceGrid[startX][startZ].isOccupied;

	    if(canOccupyStartAndEnd) {
            this._sourceGrid[startX][startZ].setOccupied(false);
	        this._sourceGrid[endX][endZ].setOccupied(false);	
        }

        var path = this._findPath(startX, startZ, endX, endZ, adjacentOnly);
            
	    if(canOccupyStartAndEnd) {
            this._sourceGrid[startX][startZ].setOccupied(o1);
	        this._sourceGrid[endX][endZ].setOccupied(o2);	
        }

	    return path;
    }

    //this.findRandomPath = function(tile1, tile2) {
    //    var path = [];
    //    var random = ~~(Math.random() * 5) + 1;
    //    var startX = tile1.xPos;
    //    var startZ = tile1.yPos;
    //    var t, endX, endZ;
    //    //console.log(random);
    //    //while(random) {

    //    	endX = startX;
    //    	endZ = startZ;
    //    	if(~~(Math.random() * 3) % 2 == 0) 
    //    		endX = ~~(Math.random() * this._width);
    //    	else
    //    		endZ = ~~(Math.random() * this._height);
 
    //    	path = path.concat(this.findPath(startX, startZ, endX, endZ, true, true));

    //    	startX = endX;
    //    	startZ = endZ;

    //    	if(startX == tile2.xPos && startZ == tile2.yPos) { 
    //    		return path;
    //    		//break;
    //    	}
    //    	--random;
    //    //}

    //    path = path.concat(this.findPath(startX, startZ, tile2.xPos, tile2.yPos, true, true));
    //    
    //    return path;
    //};

    _neighbors = (x, z, adjacentOnly) => {
        let neighborList = this._neighborList,
            neighborCount = 0,
            neighbor,
            width = this._width,
            height = this._height,
            x1Valid, x2Valid, z1Valid, z2Valid,
            z1, z2, x1, x2;

        let neighbors = [];

        if (this._wrap) {
            x1 = (x + width - 1) % width;
            x2 = (x + width + 1) % width;
            z1 = (z + height - 1) % height;
            z2 = (z + height + 1) % height;
            x1Valid = this._valid(x1, z),
            x2Valid = this._valid(x2, z);
            z1Valid = this._valid(x, z1);
            z2Valid = this._valid(x, z2);
        } else {
            x1 = x - 1;
            x2 = x + 1;
            z1 = z - 1;
            z2 = z + 1;
            x1Valid = (x1 > -1) && this._valid(x1, z),
            x2Valid = (x2 < width) && this._valid(x2, z);
            z1Valid = (z1 > -1) && this._valid(x, z1);
            z2Valid = (z2 < height) && this._valid(x, z2);
        }
            
        if (x1Valid) {
            neighbor = neighborList[neighborCount];
            neighbor.x = x1;
            neighbor.z = z;
            neighborCount++;
            neighbors.push(neighbor)
        }
        if (x2Valid) {
            neighbor = neighborList[neighborCount];
            neighbor.x = x2;
            neighbor.z = z;
            neighborCount++;
            neighbors.push(neighbor)
        }

        if (z1Valid) {
            neighbor = neighborList[neighborCount];
            neighbor.x = x;
            neighbor.z = z1;
            neighborCount++;
            neighbors.push(neighbor)

	        if(!adjacentOnly) {
                if (x2Valid && this._valid(x2, z1)) {
            	    neighbor = neighborList[neighborCount];
            	    neighbor.x = x2;
            	    neighbor.z = z1;
                    neighborCount++;
                    neighbors.push(neighbor)
                }
                if (x1Valid && this._valid(x1, z1)) {
            	    neighbor = neighborList[neighborCount];
            	    neighbor.x = x1;
            	    neighbor.z = z1;
                    neighborCount++;
                    neighbors.push(neighbor)
                }
           }
        }
        if (z2Valid) {
            neighbor = neighborList[neighborCount];
            neighbor.x = x;
            neighbor.z = z2;
            neighborCount++;
            neighbors.push(neighbor)

	        if(!adjacentOnly) {
		        if (x2Valid && this._valid(x2, z2)) {
			        neighbor = neighborList[neighborCount];
			        neighbor.x = x2;
			        neighbor.z = z2;
                    neighborCount++;
                    neighbors.push(neighbor)
		        }
		        if (x1Valid && this._valid(x1, z2)) {
			        neighbor = neighborList[neighborCount];
			        neighbor.x = x1;
			        neighbor.z = z2;
                    neighborCount++;
                    neighbors.push(neighbor)
		        }
	        }
        }
        //return neighborCount;
        return neighbors
    }

    _manhattan = (point, end) => {
        return Math.abs(point.x - end.x) + Math.abs(point.z - end.z);
    };
}
