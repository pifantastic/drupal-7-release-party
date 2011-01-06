(function($) {
	
var facebook = {
	
	name: 'facebook',
	data: [],
	since: false,
	
	url: function(params) {
		return 'http://graph.facebook.com/search?&' + $.param(params) + '&type=post&callback=?';
	},
	
	search: function(queries, callback) {
		var self = this;
		
		var params = { 
			q : queries.join(' | ')
		};
		
		if (this.since) {
			params.since = this.since;
		} else {
			params.until = parseInt(+(new Date) / 1000);
		}
		
		$.getJSON(this.url(params), function(data) {
			var posts = data.data.reverse();
			for (var x = 0; x < posts.length; x++) {
				if (posts[x].type == 'status') {
					self.data.push(self.format(posts[x]));
					self.since = posts[x].created_time;
				}
			}
			callback();
		});
	},
	
	format: function(post) {
		return {
			'id'      : post.id,
      'avatar'  : 'http://graph.facebook.com/' + post.from.id + '/picture',
      'user'    : post.from.name,
      'content' : post.message,
      'source'  : 'Facebook',
      'link'    : 'http://facebook.com/' + post.from.id + '/posts/' + post.id.split('_')[1]
    };
	}
	
};

window.facebook = facebook;
	
})(jQuery);