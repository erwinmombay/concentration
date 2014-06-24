(function() {
  var Connections, data, items;

  data = {
    _count: 46,
    _start: 0,
    _total: 47,
    values: [
      {
        firstName: "first1",
        headline: "headline1",
        id: "1",
        industry: "industrt1",
        lastName: "last1",
        pictureUrl: "pictureUrl1"
      }, {
        firstName: "first2",
        headline: "headline2",
        id: "2",
        industry: "industry2",
        lastName: "last2",
        pictureUrl: "pictureUrl2"
      }
    ]
  };

  items = [];

  Connections = function() {
    var obj, rejectCallbacks, successCallbacks;
    successCallbacks = [];
    rejectCallbacks = [];
    obj = {
      result: function(callback) {
        successCallbacks.push(callback);
        return obj;
      },
      error: function(callback) {
        rejectCallbacks.push(callback);
        return obj;
      },
      params: function() {
        return obj;
      },
      __flush: function() {
        var fn, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = successCallbacks.length; _i < _len; _i++) {
          fn = successCallbacks[_i];
          _results.push(fn(data));
        }
        return _results;
      }
    };
    items.push(obj);
    return obj;
  };

  Connections.$flush = function() {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      _results.push(item.__flush());
    }
    return _results;
  };

  window.IN = {
    API: {
      Connections: Connections
    }
  };

  afterEach(function() {
    return items.length = 0;
  });

}).call(this);
