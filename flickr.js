(function($) {
	
var flickr = {
	name: 'flickr',
	data: [],
	api_key: '',

	url: function(params) {
	  return 'http://api.flickr.com/services/rest/?method=flickr.photos.search&format=json' +
	    '&api_key=' + this.api_key + '&' + $.param(params) + '&jsoncallback=?';
	},

	thumbnail: {
	  src: function(photo, size) {
	    size = size || '_m';
	    return 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + 
	      '/' + photo.id + '_' + photo.secret + size + '.jpg'
	  },
	  avatar: function(photo) {
	    if (photo.iconfarm == 0 && photo.iconserver == 0)
	     return 'http://l.yimg.com/g/images/buddyicon.jpg';
	   else
	    return 'http://farm' + photo.iconfarm + '.static.flickr.com/' + photo.iconserver + 
	      '/buddyicons/' + photo.owner + '.jpg'
	  }
	},

	search: function(queries, callback) {
		var self = this;
		
		var params = {
			tags: queries.join(','), 
			safe_search: 1, 
			extras: 'description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_z, url_l, url_o'
		};
  
	  $.getJSON(this.url(params), function(data) {
			var photos = data.photos.photo.reverse();
			for (var x = 0; x < photos.length; x++) {
				self.data.push(self.format(photos[x]));
			}
	    callback();
	  });
	},
	
	format: function(photo) {
		return {
			'id'      : photo.id,
      'avatar'  : this.thumbnail.avatar(photo),
      'user'    : photo.ownername,
      'content' : '<img src="' + this.thumbnail.src(photo) + '" />',
      'source'  : 'Flickr',
      'link'    : 'http://flickr.com/photos/' + photo.ownername + '/status/' + photo.id
    };
	}
	
};

window.flickr = flickr;

})(jQuery);