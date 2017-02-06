var keys = require("./keys.js");
var Twitter = require('twitter');
var request = require('request');
var spotify = require('spotify');
var fs = require("fs");

console.log(process.argv);

var requestedAction = process.argv[2];
var requestedVar = process.argv[3];

var inputCommand =
{
	"twitter" : "my-tweets",
	"spotify" : "spotify-this-song",
	"omdb" : "movie-this",
	"random" : "do-what-it-says"
}

liri(requestedAction,requestedVar);


function liri(requestedAction, requestedVar){

	if(requestedAction == inputCommand.twitter){
		getTweets();

	}else if(requestedAction == inputCommand.spotify){
		if(requestedVar === undefined){
			requestedVar = "The Sign" ;
		}
		getSpotify(requestedVar);

	}else if(requestedAction == inputCommand.omdb){
		if(requestedVar === undefined){
			requestedVar = "Mr Nobody";
			console.log(requestedVar);
		}
		getOmdb(requestedVar);

	}else if(requestedAction == inputCommand.random){		

		fs.readFile("random.txt", "utf8", function(error, data) {
			// console.log(data);
		  
			var dataArr = data.split(",");
			requestedVar = dataArr[1];
			requestedAction = dataArr[0];

			liri(requestedAction, requestedVar);

		});
		
	}

	log(requestedAction + "," + requestedVar);
}



function getOmdb(requestedVar){

	var queryUrl = "http://www.omdbapi.com/?t=" + requestedVar + "&y=&plot=short&r=json";

	request(queryUrl, function(error,response,body){

		if (!error && response.statusCode == 200){
			// console.log(response);
			var data = JSON.parse(body);
			log(data);

			console.log("\n---------------------------------------\n");
			console.log("Title: " + data.Title);
			console.log("Year: " + data.Year);
			console.log("IMDB Rating: " + data.imdbRating);
			console.log("Country: " + data.Country + "\n");
			console.log("Language: " + data.language + "\n");
			console.log("Plot: " + data.Plot);	
			console.log("Starring: " + data.Actors + "\n");

			console.log("Tomato Score: " + data.tomatoUserMeter);
			console.log("Tomato URL: " + data.tomatoURL);
			console.log("\n---------------------------------------\n");
		}else{
			console.log('Error occurred: ' + error);
			return;
		}
	});
}

function getSpotify(requestedVar){

	spotify.search({ type: 'track', query: requestedVar }, function(err, data) {
		if (err) {
			 console.log('Error occurred: ' + err);
			return;
		}else{
			log(data);
			 var songData = {
		    	artist: data.tracks.items[0].artists[0].name,
		    	song: data.tracks.items[0].name,
				preview: data.tracks.items[0].preview_url,
				album: data.tracks.items[0].album.name
			}
			console.log("\n-----------------SPOTIFY-----------------------\n");
			console.log("Artist: " + songData.artist);
			console.log("Song: " + songData.song);
			console.log("Preview: " + songData.preview);
			console.log("Album: " + songData.album);
	   		console.log("\n----------------------------------------------\n");
		}
	});

}

function getTweets(){
	
	var client = new Twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = {screen_name: 'ashaaweb', count: 3};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error && response.statusCode == 200) {
			for(var i=0; i< params.count; i++){
				console.log( i+1 + ") You Tweeted - " + tweets[i].text);
				console.log("Date : " + tweets[i].created_at);
				console.log("-----------------------------------");
			}
			log(tweets);
		}else{
			console.log('Error occurred: ' + error);
			return;
		}
	});

}

function log(logData){
	// fs.appendFile('log.txt', requestedAction + "," + requestedVar + "\n", function(err){
		fs.appendFile('log.txt', "\n---------------------" + JSON.stringify(logData, null, 2) , function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log("\nLogged");
		}
	});

}
