(function() {
  describe('CardService: ', function() {
    var models, moduleName, srv, _ref;
    moduleName = 'concentration';
    _ref = [], models = _ref[0], srv = _ref[1];
    beforeEach(module(moduleName));
    beforeEach(inject(function(Models, CardService) {
      var data, raw;
      srv = CardService;
      raw = null;
      IN.API.Connections().result(function(data) {
        return raw = data.values;
      });
      IN.API.Connections.$flush();
      return models = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = raw.length; _i < _len; _i++) {
          data = raw[_i];
          _results.push(new Models.LinkedInProfile({
            data: data,
            __loaded: true
          }));
        }
        return _results;
      })();
    }));
    return it('should build a pair of view models', function() {
      var pvm;
      pvm = srv.buildCardViewModels(models);
      expect(pvm.length).toBe(2);
      return expect(pvm[0].length).toBe(2);
    });
  });

}).call(this);
