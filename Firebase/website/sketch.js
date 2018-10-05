var canvas;
var score;
var initalInput;
var submit;
var database;

function setup() {
  canvas = createCanvas(100, 100);
  canvas.parent('game')
  score = 0;
  createP('click the button to get points').parent('game');
  button = createButton('click');
  button.mousePressed(increaseScore);
  button.parent('game');
  initalInput = createInput('initals');
  initalInput.parent('game');
  submitButton = createButton('submit');
  submitButton.parent('game');
  submitButton.mousePressed(submit);


  var config = {
    apiKey: "AIzaSyCFxoAk-D5SSYHy9eqeeka_RpXD4TEpyTc",
    authDomain: "not-awesome-project-3c353.firebaseapp.com",
    databaseURL: "https://not-awesome-project-3c353.firebaseio.com",
    projectId: "not-awesome-project-3c353",
    storageBucket: "not-awesome-project-3c353.appspot.com",
    messagingSenderId: "222303331388"
  };
  firebase.initializeApp(config);
  console.log(firebase);

  database = firebase.database();
  var ref = database.ref('scores');
  ref.on('value', gotData, errData);
}

function gotData(data) {
  var scorelistings = selectAll('.scoreListing');
  for (var i = 0; i < scorelistings.length; i++){
    scorelistings[i].remove();
  }

  console.log(data.val());
  var scores = data.val();
  var keys = Object.keys(scores);
  //console.log(keys);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var initals = scores[k].name;
    var score = scores[k].score;
    var li = createElement('li', initals + ': ' + score);
    li.class('scoreListing');
    li.parent('scorelist');
  }
}

function errData(err) {
  console.log('error')
  console.log(err);
}


function submit() {
  var data = {
    name: initalInput.value(),
    score: score
  }
  console.log(data);
  var ref = database.ref('scores');
  var result = ref.push(data);
  console.log(result.key);
}

function increaseScore() {
  score++;
}


function draw() {
  background(0);
  textAlign(CENTER);
  textSize(32);
  fill(255);
  text(score, width/2, height/2);
}
