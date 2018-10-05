let nn;
let model;

let rows;
let cols;
let inputs;
let xs;

let resolution = 25;

const train_xs = tf.tensor2d([
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1]
]);

const train_ys = tf.tensor2d([
  [0],
  [1],
  [1],
  [0]
]);


function setup() {
  createCanvas(400, 400);
  cols = width / resolution;
  rows = height / resolution;

  //Create input data
  inputs = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols;
      let x2 = j / rows;
      inputs.push([x1, x2]);
    }
  }
  xs = tf.tensor2d(inputs);


  //nn = new NeuralNetwork(2, 2, 1);

  model = tf.sequential();

  let hidden = tf.layers.dense({
    units: 2,
    inputShape: [2],
    activation: 'sigmoid'
  });

  let outputs = tf.layers.dense({
    units: 1,
    activation: 'sigmoid'
  });

  model.add(hidden);
  model.add(outputs);

  const optimizer = tf.train.adam(0.1);

  model.compile({
    optimizer: optimizer,
    loss: 'meanSquaredError'
  });

  setTimeout(train, 10);
}

function trainModel() {
  return model.fit(train_xs, train_ys, {
    shuffle: true,
    epochs: 10
  });
}

function train() {
  trainModel().then(h => {
    //console.log(h.history.loss[0])
    setTimeout(train, 10);
  });
}


function draw() {
  background(0);


 tf.tidy(() => {
  //Get predictions
  let ys = model.predict(xs);
  let y_val = ys.dataSync();


  //Draw results
  let index = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let br = y_val[index] * 255;
      fill(br);
      rect(i * resolution, j * resolution, resolution, resolution);
      fill(255 - br);
      textSize(8);
      textAlign(CENTER, CENTER);
      text(nf(y_val[index],1, 2), i * resolution + resolution / 2, j * resolution + resolution / 2);
      index++;
      }
    }
  });
}
