(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  describe('GameCtrl: ', function() {
    var $timeout, ctrl, moduleName, pvm, scope, _ref;
    moduleName = 'concentration';
    _ref = [], $timeout = _ref[0], scope = _ref[1], ctrl = _ref[2], pvm = _ref[3];
    beforeEach(module(moduleName));
    beforeEach(inject(function($rootScope, $controller, CardService, Models, $templateCache, _$timeout_) {
      var data, models, raw;
      $timeout = _$timeout_;
      $templateCache.put('gameModal.html', '<div></div>');
      scope = $rootScope.$new();
      raw = null;
      IN.API.Connections().result(function(data) {
        return raw = data.values;
      });
      IN.API.Connections.$flush();
      models = (function() {
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
      pvm = CardService.buildCardViewModels(models);
      ctrl = $controller('GameCtrl', {
        $scope: scope
      });
      return ctrl.cardViewModels = pvm;
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
      beforeEach(function() {
        ctrl.start();
        return $timeout.flush();
      });
      it('should set the timer to true', function() {
        return expect(ctrl.timer).toBe(true);
      });
      it('should have a set of cards', function() {
        return expect(ctrl.cards.length).not.toBe(0);
      });
      describe('generating cards', function() {
        return it('tuple pairs should be flattened', function() {
          expect(ctrl.cardViewModels.length).toBe(2);
          return expect(ctrl.cards.length).toBe(4);
        });
      });
      return describe('stopping a game', function() {
        beforeEach(function() {
          return ctrl.stop();
        });
        it('should set the timer to false', function() {
          return expect(ctrl.timer).toBe(false);
        });
        return it('should not empty out the cards', function() {
          return expect(ctrl.cards.length).toBe(4);
        });
      });
    });
    describe('winning a game', function() {
      it('should pop up a modal', function() {
        var spy;
        spy = spyOn(ctrl, 'createModal');
        ctrl.win();
        return expect(spy).toHaveBeenCalled();
      });
      return it('should call stop', function() {
        var modal, spy;
        spy = spyOn(ctrl, 'stop');
        modal = ctrl.win();
        scope.$apply();
        modal.close();
        scope.$apply();
        return expect(spy).toHaveBeenCalled();
      });
    });
    return describe('losing a game', function() {
      it('should pop up a modal', function() {
        var spy;
        spy = spyOn(ctrl, 'createModal');
        ctrl.lose();
        return expect(spy).toHaveBeenCalled();
      });
      return it('should call stop', function() {
        var modal, spy;
        spy = spyOn(ctrl, 'stop');
        modal = ctrl.lose();
        scope.$apply();
        modal.close();
        scope.$apply();
        return expect(spy).toHaveBeenCalled();
      });
    });
  });

}).call(this);
