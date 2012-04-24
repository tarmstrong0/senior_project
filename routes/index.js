var http = require('http'),
	qs = require('querystring'),
	TWITTER_API_HOST = 'search.twitter.com',
	TWITTER_API_PATH = '/search.json',
	TWITTER_API_RESULTS = 3,
	FLICKR_API_HOST = 'api.flickr.com',
	FLICKR_API_PATH = '/services/rest/',
	FLICKR_API_METHOD = 'flickr.photos.search',
	FLICKR_API_KEY = 'd8e63b4aa3a510c0220afb9e44095c43',
	FLICKR_API_RESULTS = 3;

module.exports = {

	index : function(req, res){
		res.render('index', {
			title: 'Search Results'
		});
	},

	search : function(req, res) {
		var query = req.param('query'),
			flickrDone = false,
			twitterDone = false,
			flickrResults = [],
			twitterResults = [];

		function sendResponse() {
			res.render('search.html', {
				query : query,
				results : twitterResults,
				FLICKRresults : flickrResults
			});
		}

		var params = {
			q : query,
			rpp : TWITTER_API_RESULTS,
			include_entities : 'true'

		};

		var options = {
			host: TWITTER_API_HOST,
			port: 80,
			path: TWITTER_API_PATH + '?' + qs.stringify(params)
		};

		//make call to twitter search
		http.get(options, function(twitterResponse) {
			var data='';

			//Handle "chunks" of data as they are received
			twitterResponse.on('data', function(chunk) {
				data += chunk;
			});

			//Handle end of API response
			twitterResponse.on('end', function(){
				(JSON.parse(data).results||[]).forEach(function(result) {
					twitterResults.push({
						username : result.from_user_name,
						text : result.text,
						created : result.created_at,
						image : result.profile_image_url
					});
				});
				twitterDone = true;
				if(flickrDone) sendResponse();

			});

		}).on('error', function(e) {
			//handle error
			res.render('search.html', {
				query : query,
				results : []
			});

		});

		var FLICKRparams = {
			method : FLICKR_API_METHOD,
			api_key : FLICKR_API_KEY,
			tags : query,
			per_page : FLICKR_API_RESULTS,
			format : 'json'
		};

		var FLICKRoptions = {
			host : FLICKR_API_HOST,
			port : 80,
			path : FLICKR_API_PATH + '?' + qs.stringify(FLICKRparams)
		};

		//make call to FLICKR search
		http.get(FLICKRoptions, function(FLICKRResponse) {
			var data='';

			//Handle "FLICKRchunks" of data as they are received
			FLICKRResponse.on('data', function(chunk) {
				data += chunk;
			});

			//Handle end of API response
			FLICKRResponse.on('end', function(){
				data = data.match(/^jsonFlickrApi\((.+)\)$/)[1];
				(JSON.parse(data).photos.photo||[]).forEach(function(FLICKRresult) {
					flickrResults.push({
						farm : FLICKRresult.farm,
						server_id : FLICKRresult.server,
						photo_id : FLICKRresult.id,
						secret : FLICKRresult.secret,
					});
				});
				console.log(flickrResults);
				flickrDone = true;
				if(twitterDone) sendResponse();
			});



		}).on('error', function(e) {
			//handle error
			res.render('search.html', {
				query : query,
				results : []
			});

		});


	}

};
