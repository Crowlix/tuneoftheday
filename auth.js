var Express = require('express');
var Webtask = require('webtask-tools');
var request = require('request');
var querystring = require('querystring');
var app = Express();
app.use(require('body-parser').json());
// POST
app.get('/', function (req, res) {

	var tokens = {};
	//Request JSON data from myjson
	request('https://api.myjson.com/bins/XXXX', function (error, response, body) {
		if (!error) {
			//fill JSON oject with auth code
			tokens = JSON.parse(body);
			tokens.code = req.query.code;
			//Form data for spotify authentication
			var authdata = {
				grant_type: 'authorization_code',
				code: req.query.code,
				redirect_uri: 'https%3A%2F%2Fwt-[your url].run.webtask.io%2Fauth'
			};
			var formData = querystring.stringify(authdata);
			//Make call to spotify token service
			request({
				headers: {
					// Base64 hash of client_id:client_secret, more info: https://developer.spotify.com/web-api/authorization-guide/#tablepress-67
					'Authorization': 'Basic NTdjMjNlMGViNT.....=',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				uri: 'https://accounts.spotify.com/api/token',
				body: formData,
				method: 'POST'
			}, function (error, response, body) {
			//append tokens object with token & refresh token
				var spotifyresponse = JSON.parse(body);
				tokens.token = spotifyresponse.access_token;
				tokens.refreshtoken = spotifyresponse.refresh_token;
				//Save tokens JSON object
				request({ url: 'https://api.myjson.com/bins/XXXXX', method: 'PUT', json: tokens}, function(){
					res.send('result: ' + JSON.stringify(tokens));
				})
				
			});

		}else{
			tokens = 'error';
		}
	})

});
module.exports = Webtask.fromExpress(app);