const popTotal = 200;
var birds = [];
let sBirds = [];
var pipes = [];
let counter = 0;
let cycles = 100;
let slider;
let someP;

function keyPressed() {
  if (key === "A") {
    let bird = birds[0];
    let json = bird.brain.serialize();
    saveJSON(bird.brain, 'bird.json');
    console.log(json);
  }
}


function setup() {
  createCanvas(640, 480);
  slider = createSlider(1, 100, 1);
  someP = createP(slider.value());
  for (let i = 0; i < popTotal; i++) {
    birds[i] = new Bird();
  }
  //pipes.push(new Pipe());
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    for (var i = pipes.length-1; i >= 0; i--) {
      pipes[i].update();

      for(let j = birds.length-1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          sBirds.push(birds.splice(j, 1)[0]);
        }
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }


    for(let i = birds.length-1; i >= 0; i--) {
      if (birds[i].offscreen()) {
        sBirds.push(birds.splice(i, 1)[0]);
      }
    }


   for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }

    if (birds.length == 0) {
      counter = 0;
      nextGeneration();
      pipes = [];
      //pipes.push(new Pipe());
    }
    background(0);

    for (let bird of birds) {
      bird.show();
    }

    for (let pipe of pipes) {
      pipe.show();
    }
  }
}

// function keyPressed() {
//   if (key == ' ') {
//     bird.up();
//     //console.log("SPACE");
//   }
