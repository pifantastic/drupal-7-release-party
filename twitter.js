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