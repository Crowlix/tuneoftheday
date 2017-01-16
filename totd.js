var express    = require('express');
var Webtask    = require('webtask-tools');
var bodyParser = require('body-parser');
var request	   = require('request');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//Send a 501 (unsupported method) on GET requests
app.get('/', function (req, res) {
  res.sendStatus(501);
});
app.post('/', function (req, res) {
	//Get myjson data
	request('https://api.myjson.com/bins/XXXXX', function (error, response, body) {
		if (!error) {
			var tokens = JSON.parse(body);
			//When a spotify URI gets posted to slack, it's enveloped like this <spotifyuri>
			var spotifyuri = req.body.text.replace('totd ','').slice(1,-1);
			var trackID = spotifyuri.replace('spotify:track:','');
			if (spotifyuri.search('spotify') != -1){
			//Post track to playlist
			request({ url: 'https://api.spotify.com/v1/users/[your userid]/playlists/[playlistid]/tracks',  headers: {'Authorization': 'Bearer ' + tokens.token}, method: 'POST', json: {uris: [spotifyuri]}}, function(error,response,songbody){
					//Get track data (no authorization required)
					request('https://api.spotify.com/v1/tracks/' + trackID, function (error, response, body) {
					var songdata = JSON.parse(body);
					if(songdata.error == undefined){
				
					res.send(JSON.stringify({text: songdata.name + ' by ' + songdata.artists[0].name + ' has been added to TOTD'}));
					}else{
						//Send error if it exists
						res.send(JSON.stringify({text : JSON.stringify(songbody)}));
					}
			});
					
					
			})
			}else{
				res.send('Not a valid spotify URI');
			}
		}
		});
 
});

module.exports = Webtask.fromExpress(app);