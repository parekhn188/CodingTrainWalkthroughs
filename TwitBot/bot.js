console.log('The bot is starting');

var Twit = require('twit')

var T = new Twit({
    consumer_key:        'your key'
  , consumer_secret:     'your secret'
  , access_token:        'your token'
  , access_token_secret: 'your token secret'
})

//Stream Setup
// var stream = T.stream('user')
// //Anytime someone follows
// stream.on('tweet', tweetEvent)
//
// function tweetEvent(eventMsg){
//   //var fs = require('fs')
//   //var json = JSON.stringify(eventMsg, null, 2)
//   //fs.writeFile('tweet.json', json)
//   var replyto = eventMsg.in_reply_to_screen_name
//   var text = eventMsg.text
//   var from = eventMsg.user.screen_name
//
//   console.log(replyto + ' '+ from);
//
//   if(replyto == 'NodeTestJSON'){
//     var newtweet = '@' + from + ' ' + 'thank you for tweeting me'
//     tweetIt(newtweet)
//   }
// }

//Scheduling setup



tweetIt()
setInterval(tweetIt, 1000*60*20)

//Posting
function tweetIt(txt){
var r = Math.floor(Math.random()*100)
  var tweet = {
    status: 'node bot loves the number' + ' '+ r
  }

  T.post('statuses/update', tweet, tweeted);
  function tweeted(err, data, response){
    if (err){
      console.log('something went wrong');
    } else {
        console.log('It worked!');
      }
    }
}
