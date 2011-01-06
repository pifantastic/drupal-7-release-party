(function($) {
	
var twitter = {
	
	name: 'twitter',
	
	data: [],
	
	last_id: false,
	
	url: function(params) {
		return 'http://search.twitter.com/search.json?&' + $.param(params) + '&result_type=recent&rpp=100&callback=?';
	},

	search: function(terms, callback) {
		terms = terms || [];

    var params = { q: terms.join(' OR ') }
				self = this;

    if (this.last_id) 
      params.since_id = this.last_id;
			
		$.getJSON(this.url(params), function(data) {
			var tweets = data.results.reverse();
			for (var x = 1; x < tweets.length; x++) {
				self.data.push(self.format(tweets[x]));
			}
			
			if (tweets.length) {
				this.last_id = tweets[tweets.length - 1].id;
			}
			
			callback();
		});
	},
	
	format: function(tweet) {
		return {
			'id'      : tweet.id,
      'avatar'  : tweet.profile_image_url,
      'user'    : tweet.from_user,
      'content' : helpers.linkTweet(tweet.text),
      'source'  : 'Twitter',
      'link'    : 'http://twitter.com/' + tweet.from_user + '/status/' + tweet.id
    };
	}
};

window.twitter = twitter;

})(jQuery);
