var request = require('request');
var querystring = require('querystring');
module.exports = 
    function (cb) {
		//Get the myjson data
        request.get('https://api.myjson.com/bins/XXXX', function (error, res, body) {
            if (error)
                cb(error);
            else
				var tokens = JSON.parse(body);
							//Form data for spotify authentication
			var authdata = {
				grant_type: 'refresh_token',
				refresh_token: tokens.refreshtoken			
			};
			var formData = querystring.stringify(authdata);
			//Make call to spotify token service
			request({
				// Base64 hash of client_id:client_secret, more info: https://developer.spotify.com/web-api/authorization-guide/#tablepress-67
				headers: {
					'Authorization': 'Basic NTdjXXXXXXczZDk=',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				uri: 'https://accounts.spotify.com/api/token',
				body: formData,
				method: 'POST'
			}, function (error, response, body) {
			//update tokens object with new token
				var spotifyresponse = JSON.parse(body);
				tokens.token = spotifyresponse.access_token;
				//Save tokens JSON object
				request({ url: 'https://api.myjson.com/bins/XXXXX', method: 'PUT', json: tokens}, function(){
					cb(null, JSON.stringify(tokens));
				})
				
			});
                
        });
    }