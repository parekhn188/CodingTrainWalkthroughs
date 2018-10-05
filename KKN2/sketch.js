var data;
var resultP;
var resultD = [];
var users;
var button

function preload() {
  data = loadJSON('movies.json');
}

function setup() {
  noCanvas();
  users = {};
  var dropDowns = [];

  var titles = data.titles;
  for (var i = 0; i < titles.length; i++) {
    var div = createDiv(titles[i] + ' ');
    var dropDown = createSelect('');
    dropDown.title = titles[i];
    dropDown.option('Not seen');
    dropDown.parent(div);
    dropDowns.push(dropDown);
    for (var star = 1; star < 6; star++) {
      dropDown.option(star);
    }
  }

  // var dropDown1 = createSelect();
  // for (var i = 0; i < data.users.length; i++) {
  //   var name = data.users[i].name;
  //   dropDown1.option(name);
  //   users[name] = data.users[i];
  // }

  var button = createButton("submit");
  button.mousePressed(predictRatings);
  resultP = createP('');

  function predictRatings()  {
    var newUser = {};
    for (var i = 0; i < dropDowns.length; i++) {
      var title = dropDowns[i].title;
      var rating = dropDowns[i].value();
      if (rating == 'Not seen') {
        rating = null;
      }
      newUser[title] = rating;
    }
    findNearestNeighbors(newUser);
  }


  function findNearestNeighbors(user) {
    for (i = 0; i < resultD.length; i++) {
      resultD[i].remove();
    }
    resultD = [];

    var similarityScores = {};
    for (var i = 0; i < data.users.length; i++) {
      var other = data.users[i];
      var similarity = euclideanDistance(user, other );
      similarityScores[other.name] = similarity;
    }

    data.users.sort(compareSimilarity);

    function compareSimilarity(a, b) {
      var score1 = similarityScores[a.name];
      var score2 = similarityScores[b.name];
      return score2 - score1;
    }

    for (var i = 0; i < data.titles.length; i++) {
      var title = data.titles[i];
      if (user[title] == null) {
        var wightedSum = 0;
        var similaritySum = 0;
        var iterate = 5
        for (var j = 0; j < iterate; j++) {
          var name = data.users[j].name;
          var score = similarityScores[name];
          var ratings = data.users[j];
          var rating = ratings[title];
          if (rating != null) {
            wightedSum += rating * score;
            similaritySum += score;
          }
        }
        var stars = nf(wightedSum/similaritySum, 1, 2);
        var div = createDiv(title + ': ' + stars);
        resultD.push(div);
        div.parent(resultP);
      }
    }
  }
}


function euclideanDistance(ratings1, ratings2) {
    var titles = data.titles;

    var sumSquares = 0;
    for (var i = 0; i < titles.length; i++ ) {
      var title = titles[i];
      var rating1 = ratings1[title];
      var rating2 = ratings2[title];
      if (rating1 != null && rating2 != null) {
        var difference = rating1 - rating2;
        sumSquares += difference*difference;
      }
    }
    var d = sqrt(sumSquares);
    var similarity = 1/(1+d);
    return similarity;
  }
