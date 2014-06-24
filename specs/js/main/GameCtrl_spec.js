(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  describe('GameCtrl: ', function() {
    var ctrl, moduleName, scope, _ref;
    moduleName = 'concentration';
    _ref = [], scope = _ref[0], ctrl = _ref[1];
    beforeEach(module(moduleName));
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      return ctrl = $controller('GameCtrl', {
        $scope: scope
      });
    }));
    describe('initial state of game controller', function() {
      it('should have the timer set to false', function() {
        return expect(ctrl.timer).toBe(false);
      });
      it('should have 0 cards', function() {
        return expect(ctrl.cards.length).toBe(0);
      });
      it('should not show the image', function() {
        return expect(ctrl.showImg).toBe(false);
      });
      it('should have 3 levels of difficulty', function() {
        var diff, keys, _i, _len, _ref1, _results;
        expect(ctrl.difficulties).toEqual(['easy', 'medium', 'hard']);
        keys = _.keys(ctrl.difficulty);
        _ref1 = ctrl.difficulties;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          diff = _ref1[_i];
          _results.push(expect(__indexOf.call(keys, diff) >= 0));
        }
        return _results;
      });
      it('should default to easy difficulty', function() {
        return expect(ctrl.curDifficulty).toBe('easy');
      });
      return it('should have 0 matched cards', function() {
        return expect(ctrl.matchedCards.length).toBe(0);
      });
    });
    describe('starting a game', function() {
      beforeEach(function() {});
      return it('should be able to start a new game', function() {});
    });
    return describe('stopping a game', function() {});
  });

}).call(this);
