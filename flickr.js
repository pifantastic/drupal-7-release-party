(function($) {
	
var flickr = {
	
	settings: {
	  api_key: ''
	},

	url: function(method, params) {
	  return 'http://api.flickr.com/services/rest/?method=' + method + '&format=json' +
	    '&api_key=' + flickr.settings.api_key + ($.isEmptyObject(params) ? '' : '&' + $.param(params)) + '&jsoncallback=?'
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
	  },
	  imageTag: function(image) {
	    return '<img src="' + image.src + '" alt="' + image.alt + '" />'
	  }
	},

	exec: function(method, params, callback) {
	  params = params || {};
	  callback = $.isFunction(callback) ? callback : function() {};
  
	  $.getJSON(flickr.url(method, params), function(data) {
	    var photos = data.photos || data.photoset;
	    callback(photos.photo);
	  });
	},
	
	search: function(params, callback) {
		this.exec('flickr.photos.search', params, function(photos) {
			callback(photos);
		});
	}
	
};

window.flickr = flickr;

})(jQuery);