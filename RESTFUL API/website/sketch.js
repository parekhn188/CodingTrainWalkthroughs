function setup() {
  createCanvas(300, 200);
  //drawData();
  console.log('running');

  var buttonS = select('#submit');
  buttonS.mousePressed(submitWord);

  // var buttonA = select('#analyze');
  // buttonA.mousePressed(analyzeThis);
}

// function drawData() {
//   loadJSON('all', gotData)
// }

function analyzeThis() {
  var txt = select('#textinput').value();
  var data = {
    text:txt
  }
  httpPost('analyze/', data, 'json', dataPosted, postError);
}

function dataPosted(result) {
  console.log(result);
}

function postError(err) {
  console.log(err);
}


function submitWord() {
  var word = select('#word').value();
  var score = select('#score').value();
  console.log(word, score);

  loadJSON('add/' + word + '/' + score, finished);

  function finished(data) {
    console.log(data);
    //drawData();
  }
}

// function gotData(data) {
//   background(51);
//   console.log(data);
//   var key = Object.keys(data);
//   for(var i = 0; i < key.length; i++) {
//     var word = key[i];
//     var score = data[word];
//     var x = random(width);
//     var y = random(height);
//     fill(255);
//     textSize(16);
//     text(word, x, y);
//   }
//}
