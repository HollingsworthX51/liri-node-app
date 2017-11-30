console.log('this is working');

//load our keys and variables
var keys = require('./keys.js'); //load twitter keys
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

//take in command line arguments
var userInput = process.argv[2];
var userChoice = process.argv[3];

//node commands for liri app here - using switch - or trying out switch
switch (userInput) {
	case "my-tweets":
		showTweets();
		break;
	case "spotify-this-song":
		spotifyThisSong();
		break;
	case "movie-this":
		movieThis();
		break;
	case "do-what-it-says":
		doWhatItSays();
		break;
};

//time for some functions god help us all.

//twitter function

function showTweets() {

	var client = new twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});

	var params = {
		screen_name: 'DrStevenRobot',
		count: 20,
	};

	client.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (!error) {
			for (var i = 0; i < tweets.length; i++) {
				console.log("Tweet : '" + tweets[i].text + "' , created at " + tweets[i].created_at);
			}
		} else {
			console.log(error);
		};
	});

};

//spotify function
function spotifyThisSong() {
	var songInput = "The%20Sign%20Ace%20of%20Base"
	var spotify = new Spotify({
		id: '0704f398bd684e3ba9a40a0b06c8ecac',
		secret: 'aeee3847e7b245d39ea3501a668da976',
	});

	if (userChoice !== undefined) {
		songInput = userChoice;
	}

	spotify.search({
		type: 'track',
		query: songInput,
	}, function (err, data) {
		if (err) {
			console.log('Error occurred: ' + err);
		} else {
			console.log(JSON.stringify(data, null, 2));
			console.log("Artist: " + data.tracks.items[0].artists[0].name);
		};
	});

};

//movie funcion

//apiKey = "40e9cece";

function movieThis(value) {
	if (value === undefined) {
		value = 'Mr. Nobody';
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=40e9cece";

	console.log(queryUrl);

	request(queryUrl, function (error, response, body) {
		var movieData = JSON.parse(body);
		// If the request is successful
		if (!error && response.statusCode === 200) {
			//Display information based on the movie that was submitted
			console.log("Release Year: " + movieData.Year, "\nMovie Title: " + movieData.Title, "\nIMDB Rating: " +
				movieData.imdbRating, "\nRotten Tomatoes Rating: " + movieData.tomatoRating, "\nCountry of Production: " + movieData.Country,
				"\nLanguage of the Movie: " + movieData.Language, "\nPlot: " + movieData.Plot, "\nActors: " + movieData.Actors);
		}
	});

}

//doWhatItSays function - last one!
function doWhatItSays() {
	//read file and process
	fs.readFile("random.txt", "utf8", function (err, data) {
		if (err) {
			console.log("read file error - " + err);
		} else {
			// console.log(data);
			var dataArr = data.split(",");
			// console.log(dataArr);
			switch (dataArr[0]) {
				case "spotify-this-song":
					var songName = dataArr[1];
					songName = songName.substring(1, songName.length - 1);
					spotifyThisSong(songName);
					break;
			}
		}
	});
}