(function() {
  describe('SidebarCtrl: ', function() {
    var ctrl, moduleName, scope, _ref;
    moduleName = 'concentration';
    _ref = [], scope = _ref[0], ctrl = _ref[1];
    beforeEach(module(moduleName));
    beforeEach(inject(function($rootScope, $controller) {
      var cardViewModels;
      scope = $rootScope.$new();
      cardViewModels = Array(20);
      scope.gameCtrl = {
        difficulty: {
          easy: 10
        },
        numOfCards: 10,
        cardViewModels: cardViewModels
      };
      return ctrl = $controller('SidebarCtrl', {
        $scope: scope
      });
    }));
    describe('increasing the card count', function() {
      beforeEach(function() {
        return ctrl.increaseCards(10);
      });
      it('should increase the number of cards', function() {
        return expect(scope.gameCtrl.numOfCards).toBe(20);
      });
      it('shouldnt when its over the cardviewmodels count', function() {
        ctrl.increaseCards(10);
        return expect(scope.gameCtrl.numOfCards).not.toBe(20);
      });
      return describe('decreasing the number of cards', function() {
        beforeEach(function() {
          return ctrl.decreaseCards(10);
        });
        it('should decrease the the card count', function() {
          return expect(scope.gameCtrl.numOfCards).toBe(10);
        });
        return it('shouldnt when its going to go below 10', function() {
          expect(scope.gameCtrl.numOfCards).toBe(10);
          ctrl.decreaseCards(10);
          return expect(scope.gameCtrl.numOfCards).toBe(10);
        });
      });
    });
    return describe('getting the duration', function() {
      it('should compute the correct number of ms', function() {
        var dur;
        dur = ctrl.getDuration(10, 30);
        return expect(dur).toBe(30000);
      });
      return it('should default to the game difficulty multiplier', function() {
        var dur;
        dur = ctrl.getDuration(10);
        return expect(dur).toBe(10000);
      });
    });
  });

}).call(this);
