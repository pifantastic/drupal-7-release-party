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
      'content' : tweet.text,
      'source'  : 'Twitter',
      'link'    : 'http://twitter.com/' + tweet.from_user + '/status/' + tweet.id
    };
	}
};

window.twitter = twitter;

})(jQuery);

/*
(function($) {
	
var twitter = {
	
	url: function(params) {
		return 'http://search.twitter.com/search.json?&'+$.param(params)+'&rpp=30&callback=?';
	},
	
	search: function(params, callback) {
		$.getJSON(this.url(params), function(data) {
			var tweets = (data.results || data);
			callback(tweets);
		});
	}
	
};

$.fn.extend({
  linkUrl: function() {
    var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
    this.each(function() {
      $(this).html($(this).html().replace(regexp,"<a href=\"$1\">$1</a>"));
    });
    return this;
  },
  
  linkUser: function() {
    var regexp = /[\@]+([A-Za-z0-9-_]+)/gi;
    this.each(function() {
      $(this).html($(this).html().replace(regexp,"<a href=\"http://twitter.com/$1\">@$1</a>"));
    });
    return this;
  },
  
  linkHash: function() {
    var regexp = /(?:^| )[\#]+([A-Za-z0-9-_]+)/gi;
    this.each(function() {
      $(this).html($(this).html().replace(regexp, ' <a href="http://search.twitter.com/search?q=&tag=$1&lang=all">#$1</a>'));
    });
    return this;
  }
});

window.twitter = twitter;
	
})(jQuery);
*/