const len = 784;
const dataTotal = 1000;
const CAT = 0;
const RAINBOW = 1;
const TRAIN  = 2;

let catsData;
let rainbowsData;
let trainsData;

let cats = {};
let trains = {};
let rainbows = {};

let catP;
let trainP;
let rainbowP;

let nn;

function preload() {
  catsData = loadBytes('data/cats1000.bin');
  trainsData = loadBytes('data/trains1000.bin');
  rainbowsData = loadBytes('data/rainbows1000.bin');
}

function prepData(category, data, label) {
  category.training = [];
  category.testing = [];

  for (let i = 0; i < dataTotal; i++) {
    let threshold = floor(0.8 * dataTotal);
    let offset = i * len;
    if (i < threshold) {
      category.training[i] = data.values.subarray(offset, offset + len);
      category.training[i].label = label
    } else {
      category.testing[i - threshold] = data.values.subarray(offset, offset + len);
      category.testing[i - threshold].label = label
    }
  }
}

function trainEpoch(training) {
  shuffle(training, true);
  //Train for one epoch
  for (let i = 0; i < training.length; i++) {
    let data = training[i];
    let inputs = Array.from(data).map(x => x/255);
    //console.log(data);
    let label = training[i].label;
    let targets = [0, 0, 0];
    targets[label] = 1;
    //console.log(inputs);

    nn.train(inputs, targets);
  }
}


function testAll(testing) {
  let correct = 0;

  for (let i = 0; i < testing.length;  i++) {
    let data = testing[i];
    let inputs = Array.from(data).map(x => x/255);
    let label = data.label;
    let guess = nn.predict(inputs);

    let classification = guess.indexOf(max(guess));

    if (classification == label) {
      correct++;
    }
  }
  let percent = correct/testing.length;
  return percent;
}




function setup() {
  createCanvas(280, 280);
  background(255);

  //Data preperation
  prepData(cats, catsData, CAT);
  prepData(rainbows, rainbowsData, RAINBOW);
  prepData(trains, trainsData, TRAIN);

  //NN init
  nn = new NeuralNetwork(784, 64, 3);

  //Randomizing
  let training = [];
  training = training.concat(cats.training);
  training = training.concat(trains.training);
  training = training.concat(rainbows.training);

  let testing = [];
  testing = testing.concat(cats.testing);
  testing = testing.concat(trains.testing);
  testing = testing.concat(rainbows.testing);

  let trainButton = select('#train');
  let epochCounter = 0
  trainButton.mousePressed(function() {
    trainEpoch(training);
    epochCounter++;
    console.log("Epoch: " + epochCounter)
  });

  let testButton = select('#test');
  testButton.mousePressed(function() {
    let percent = testAll(testing);
    console.log("Correct: " + (percent *100) + "%");
  });

  let clearButton = select('#clear');
  clearButton.mousePressed(function() {
    background(255);
  });

  let guessButton = select('#guess');
  guessButton.mousePressed(function() {
    let inputs = [];
    let img = get();
    img.resize(28, 28);
    img.loadPixels();
    for (let i = 0; i < len; i++) {
      let brightness = img.pixels[i * 4];
      inputs[i] = (255 - brightness)/255;
    }
    let guess = nn.predict(inputs);
    let classification = guess.indexOf(max(guess));
    if (classification === CAT) {
      console.log('cat');
    } else if (classification === RAINBOW) {
      console.log("rainbow")
    } else if (classification === TRAIN) {
      console.log("train")
    }
  });
}


function draw() {
  strokeWeight(16);
  stroke(0);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }

}












  // let total = 100;
  // for (let n = 0; n < total; n++) {
  //   let img = createImage(28, 28);
  //   img.loadPixels();
  //   let offset = n * 784;
  //   for (let i = 0; i < 784; i++) {
  //     let val =  255 - catsData.values[i + offset];
  //     img.pixels[i * 4] = val;
  //     img.pixels[i * 4 + 1] = val;
  //     img.pixels[i * 4 + 2] = val;
  //     img.pixels[i * 4 + 3] = 255;
  //   }
  //   img.updatePixels();
  //   let x = (n % 10) * 28;
  //   let y = floor(n/10) * 28;
  //   image(img, x, y);
