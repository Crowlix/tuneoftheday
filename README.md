<h2>What does this do?</h2>
<p>Whenever someone posts a spotify URI in a slack channel, the webtask adds the track to a playlist of choice.</p>
<p>The project consists out of 3 webtasks and 1 online JSON storage</p>

<h2>What do I need to set this up?</h2>
<ul>
<li>A <a href="https://webtask.io">webtask.io account</a></li>
<li>An online JSON file hosted on <a href="http://myjson.com/">myjson.com</a></li>
<li>A slack channel with an <a href="https://api.slack.com/outgoing-webhooks">outgoing webhook</a></li>
<li>A registered <a href="https://developer.spotify.com/my-applications/#!/applications">Spotify app</a></li>
</ul>

<h2>Setup guide</h2>
<ol>
<li><h3>Authenticating with a webtask</h3><p>In my case I named it auth, this webtask will be used as the callback URL for the Spotify authentication. It expects a URL parameter called 'code' and it will populate the myjson data with an authentication code, access- and refreshtoken from Spotify. You can leave the callback_uri empty at first. After you create the webtask, fill in its URI as the callback (why this is the case will be explained in the step 2)</p></li>
<li><h3>Call the Spotify authentication URI</h3><p>In order to consume the Spotify API you'll need to authenticate once. Your auth link should look like this: <strong>https://accounts.spotify.com/authorize?client_id=[client_id]&response_type=code&redirect_uri=[redirect_uri]&scope=playlist-modify-public</strong></p><p>The <strong>client_id</strong> can be found in your Spotify app's settings. The <strong>redirect_uri</strong> has to be equal to what you filled in as the callback uri in step 1. Remember to URLencode this URI and whitelist it in your Spotify app's settings</p><p>Make sure you save this link somewhere in case you need to re-authenticate. When you hit this link, you can log into Spotify and you'll get redirected to your webtask.You should now have data in your myjson file<p></li>
<li><h3>Refreshing the token</h3><p>Unfortunately Spotify tokens expire after an hour and need to be refreshed. Luckily webtask.io provides us with a way to schedule webtasks periodically. I named this webtask tokenrefresh, it gets the myjson refresh token and gets a new access token from the Spotify tokenservice. All you need to do to the file is change the myjson URI and the Authentication header. </p><p>The easiest way to schedule this webtask is via the webtask editor. The editor can be found at the bottom of https://webtask.io/cli given that you created the hello.js webtask</p></li>
<li><h3>Adding the track to the playlist</h3><p>Totd.js is the webtask that will parse the incoming POST request from Slack and call the Spotify API to add the track + get the song's data for the response to Slack. In the file you'll need to paste your myjson URI, your user- and your playlistID</p></li>
<li><h3>Creating the outgoing webhook</h3><p>Add an <a href="">outgoing webhook</a> to your Slack channel that calls the totd webtask and matches on <strong>"&lt;spotify"</strong>. The <strong>&lt;</strong> is necessary because Slack automatically adds these to any URI.</p></li>
<li><h3>Add some tunes!</h3><p>Post a Spotify track URI to your slack channel like the one below and see your playlist grow!</p><p><strong>spotify:track:23W5DHu31ZLW9q0p2wQxfN</strong></li>
</ol>
