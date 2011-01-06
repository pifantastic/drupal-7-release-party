var helpers = {
  linkText: function(text) {
    var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
    return text.replace(regexp,"<a href=\"$1\">$1</a>");
  },

  linkTwitterUser: function(text) {
    var regexp = /[\@]+([A-Za-z0-9-_]+)/gi;
    return text.replace(regexp,"<a href=\"http://twitter.com/$1\">@$1</a>");
  },

  linkTwitterHash: function(text) {
    var regexp = /(?:^| )[\#]+([A-Za-z0-9-_]+)/gi;
    return text.replace(regexp, ' <a href="http://search.twitter.com/search?q=&tag=$1&lang=all">#$1</a>');
  },

	linkTweet: function(tweet) {
		tweet = this.linkText(tweet);
		tweet = this.linkTwitterUser(tweet);
		return this.linkTwitterHash(tweet);
	}
};