var cols = 50;
var rows = 50;
var grid = new Array(cols);
var start;
var end;
var path = [];

var w;
var h;

var openSet = [];
var closedSet = [];

function removeFromArray(arr, element) {
  for (var i = arr.length-1; i>=0; i--) {
    arr.splice(i, 1);
  }
}

function heuristic(a, b) {
  var d = dist(a.i, a.k, b.i, b.k);
  //var d = abs(a.i-b.i) + abs(a.k-b.k);
  return d;
}

function Spot(i, k) {
  this.i = i;
  this.k = k;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.3) {
    this.wall = true;
  }

  this.show = function (color) {
    fill(color);
    if (this.wall) {
      fill(0);
      noStroke();
      ellipse(this.i*w + w/2, this.k*h + h/2, w/2, h/2);
    }
  }

    this.addNeighbors = function(grid) {
      var i = this.i;
      var k = this.k;
      if (i < cols -1){
        this.neighbors.push(grid[i+1][k]);
      }
      if (i > 0) {
        this.neighbors.push(grid[i-1][k]);
      }
      if (k < rows-1) {
        this.neighbors.push(grid[i][k+1]);
      }
      if (k > 0) {
        this.neighbors.push(grid[i][k-1]);
      }
      if (i > 0 && k > 0) {
        this.neighbors.push(grid[i-1][k-1]);
      }
      if (i < cols-1 && k > 0) {
        this.neighbors.push(grid[i+1][k-1]);
      }
      if (i < 0 && k > rows - 1) {
        this.neighbors.push(grid[i-1][k+1]);
      }
      if (i < cols-1 && k < rows-1) {
        this.neighbors.push(grid[i+1][k+1]);
      }
    }
  }

function setup() {
  createCanvas(400, 400);

  w = width/cols;
  h = height/rows;

  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var k = 0; k < rows; k++) {
      grid[i][k] = new Spot(i, k);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var k = 0; k < rows; k++) {
      grid[i][k].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols-1][rows-1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);
}

function draw() {
  background(255);
  if (openSet.length > 0) {
    var lowestIndex = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    var current = openSet[lowestIndex];

    if (current == end) {
      noLoop();
      console.log('Done!');
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + 1;

        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
  } else {
    console.log('no solution');
    noLoop();
    return;
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  for (var i = 0; i < closedSet.length; i++){
    closedSet[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  //find the path
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (var i = 0; i < path.length; i++) {
    //path[i].show(color(0, 0, 255));
  }
    noFill();
    beginShape();
    stroke(255,0,0);
    strokeWeight(4);
    for (var i = 0; i < path.length; i++) {
      vertex(path[i].i * w + w/2, path[i].k*h + h/2);
    }
    endShape();
}
