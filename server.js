var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var data = fs.readFileSync('words.json');
var affindata = fs.readFileSync('affin111.json');
var app = express();
var server = app.listen(3000, listening);

var words = JSON.parse(data);
var affin = JSON.parse(affindata);

console.log('sever is starting');



function listening() {
  console.log('listening...');
}

app.use(express.static('website'));

//Parse application (using body parser)
app.use(bodyParser.urlencoded({extended: true}));
//Parse in json
app.use(bodyParser.json());

//Route 1
app.post('/analyze', analyzeThis);
function analyzeThis(request, response) {
  var txt = request.body.text;
  var words = txt.split(/\W+/);
  var totalScore = 0;
  var wordList = [] ;
  for (var i = 0; i < words.length; i++){
    var word = words[i];
    var found = false;
    var score = 0;
    if (words.hasOwnProperty(word)) {
      score = Number(words[word]);
      found = true;
    } else if (affin.hasOwnProperty(word)) {
      score = Number(affin[word]);
      found = true;
    }
    if (found) {
      wordList.push({
        word: word,
        score: score
      })
    }
    totalScore += score;
  }

  var comparative = totalScore/words.length;

  var reply = {
    score: totalScore,
    words: wordList,
    comparative: comparative
  }
  response.send(reply);
}

app.get('/add/:word/:score?', addWord);
function addWord(request, response) {
  var data = request.params;
  var word = data.word;
  var score = Number(data.score);
  if(!score) {
    var reply = {
      msg: "score is required"
  }
  response.send(reply);
} else {
  words[word] = score;
  var data = JSON.stringify(words, null, 2);
  fs.writeFile('words.json', data, finished);

  function finished(err) {
    console.log('all set')
    var reply = {
        word: word,
        score: score,
        status: "Success"
      }
      response.send(reply);
    }
  }
}


//Route 2
app.get('/all', sendAll);

function sendAll(request, response) {
  var data = {
    words: words,
    affin: affin
  }
  response.send(data);
}

//Route 3
app.get('/search/:word/', searchWord);

function searchWord(request, response) {
  var word = request.params.word;
  var reply;
  if (words[word]) {
    reply = {
      status: "found",
      word: word,
      score: words[word]
    }
  } else {
    reply = {
      status: "not found",
      word: word
    }
  }
  response.send(reply);
}
