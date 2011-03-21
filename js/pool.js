
var DataPool = function(sources, queries) {
  this.init(sources, queries);
};

DataPool.prototype = {
  queries: [],
  live_sources: [],
  dormant_sources: [],

  init: function(sources, queries) {
    var self = this;
    self.queries = queries;

    for (var x = 0; x < sources.length; x++) {
      var source = sources[x];
      if (source.data.length) {
        self.promote(source);
      } else {
        self.demote(source);
      }
    }
  },

  promote: function(source) {
    for (var x = 0; x < this.dormant_sources.length; x++) {
      if (this.dormant_sources[x].name == source.name) {
        this.dormant_sources.splice(x, 1);
      }
    }

    this.live_sources.push(source);
  },

  demote: function(source) {
    var self = this;

    for (var x = 0; x < this.live_sources.length; x++) {
      if (this.live_sources[x].name == source.name) {
        this.live_sources.splice(x, 1);
      }
    }

    this.dormant_sources.push(source);

    // Try to promote every minute.
    source.interval = setInterval((function() {
      source.search(self.queries, function() {
        if (source.data.length) {
          self.promote(source);
          clearInterval(source.interval);
        }
      });

      return arguments.callee;
    })(), 60000);
  },

  pluck: function() {
    if (this.live_sources.length) {
      var source = this.live_sources[this.rand(0, this.live_sources.length - 1)];
      var data = source.data.pop();
      if (source.data.length == 0) {
        this.demote(source);
      }
      return data;
    }

    return null;
  },

  rand: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};
