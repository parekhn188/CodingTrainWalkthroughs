
  let data;
  let model;
  let xs;
  let ys;
  let lossP;
  let labP;
  let rS, gS, bS;

  let labelList = [
    'red-ish',
    'green-ish',
    'blue-ish',
    'orange-ish',
    'yellow-ish',
    'pink-ish',
    'purple-ish',
    'brown-ish',
    'grey-ish'
  ];

  function preload() {
    data = loadJSON('colorData.json');
  }


  function setup() {
    lossP = createP('loss');
    labP = createP('');

    rS = createSlider(0, 255, 255);
    gS = createSlider(0, 255, 255);
    bS = createSlider(0, 255, 0);

    let colors = [];
    let labels = [];

    for (let record of data.entries) {
      let col = [record.r/255, record.g/255, record.b/255];
      colors.push(col);
      labels.push(labelList.indexOf(record.label));
    }

    xs = tf.tensor2d(colors);
    let labelsTensor = tf.tensor1d(labels, 'int32');

    ys = tf.oneHot(labelsTensor, 9);
    labelsTensor.dispose();

    model = tf.sequential();
    const hidden = tf.layers.dense({
      units: 16,
      //Essentially the definition of the input layer
      inputShape: [3],
      activation: 'sigmoid'
    });

    let output = tf.layers.dense({
      units: 9,
      activation: 'softmax'
    });

    model.add(hidden);
    model.add(output);

    let lr = 0.2;
    const optimizer = tf.train.adam(lr);

    model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy'
    });

    train();
  }

async function train() {
  await model.fit(xs, ys, {
    shuffle: true,
    validationSplit: 0.1,
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(epoch);
        lossP.html('loss: ' + logs.loss.toFixed(5));
      },
      onBatchEnd: async (batch, logs) => {
        await tf.nextFrame();
      },
      onTrainEnd: () => {
        console.log('finished')
      },
    },
  });
}

  function draw() {
    let r = rS.value();
    let g = gS.value();
    let b = bS.value();
    background(r, g, b);

    tf.tidy(() => {
    const xs = tf.tensor2d([
      [r, g, b]
    ]);

    let results = model.predict(xs);
    let args = results.argMax(1);
    let index = args.dataSync()[0];
    let label = labelList[index];
    labP.html(label);
  });
}
