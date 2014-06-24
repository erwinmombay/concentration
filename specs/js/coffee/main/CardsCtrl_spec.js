(function() {
  describe('CardsCtrl:', function() {
    var card1, card1a, card2, card3, ctrl, moduleName, pair, scope, _ref;
    moduleName = 'concentration';
    _ref = [], ctrl = _ref[0], pair = _ref[1], scope = _ref[2], card1 = _ref[3], card2 = _ref[4], card3 = _ref[5], card1a = _ref[6];
    card1 = null;
    beforeEach(module(moduleName));
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('CardsCtrl', {
        $scope: scope
      });
      card1 = {
        id: 1,
        matched: false,
        flipped: false,
        type: 'info'
      };
      card2 = {
        id: 2,
        matched: false,
        flipped: false
      };
      card3 = {
        id: 3,
        matched: false,
        flipped: false
      };
      card1a = {
        id: 1,
        matched: false,
        flipped: false,
        type: 'img'
      };
      scope.gameCtrl = {
        cards: [card1, card1a],
        timer: true,
        win: function() {},
        lose: function() {}
      };
      spyOn(scope.gameCtrl, 'win');
      spyOn(scope.gameCtrl, 'lose');
      return pair = [];
    }));
    return describe('clicking on a card', function() {
      describe('when the timer is on', function() {
        beforeEach(function() {
          return pair = ctrl.onCardClick(card1);
        });
        it('should be marked flipped', function() {
          return expect(card1.flipped).toBe(true);
        });
        it('should place the card as the 1st item of a pair', function() {
          var a, b;
          a = pair[0], b = pair[1];
          expect(a).toBe(card1);
          return expect(b).toBeUndefined();
        });
        it('should unflip the card when you click on the same card twice', function() {
          var a, b, _ref1;
          expect(card1.flipped).toBe(true);
          _ref1 = ctrl.onCardClick(card1), a = _ref1[0], b = _ref1[1];
          expect(card1.flipped).toBe(false);
          expect(a).toBeUndefined();
          return expect(b).toBeUndefined();
        });
        describe('and also click on a second non matching card', function() {
          beforeEach(function() {
            return pair = ctrl.onCardClick(card2);
          });
          it('should place the 2nd card as the 2nd item in the pair', function() {
            var a, b;
            a = pair[0], b = pair[1];
            expect(card1).toBe(a);
            return expect(card2).toBe(b);
          });
          it('should also flip the 2nd card', function() {
            expect(card1.flipped).toBe(true);
            return expect(card2.flipped).toBe(true);
          });
          it('should not match when the 2nd card is not the same id as the 1st card', function() {
            expect(card1.matched).toBe(false);
            return expect(card2.matched).toBe(false);
          });
          describe('clicking on a card that is already in the pair', function() {
            it('should unflip both cards', function() {
              ctrl.onCardClick(card2);
              expect(card1.flipped).toBe(false);
              return expect(card2.flipped).toBe(false);
            });
            return it('should empty out the pair', function() {
              var a, b, _ref1;
              _ref1 = ctrl.onCardClick(card2), a = _ref1[0], b = _ref1[1];
              expect(a).toBeUndefined();
              return expect(b).toBeUndefined();
            });
          });
          return describe('clicking on a 3rd card', function() {
            beforeEach(function() {
              return pair = ctrl.onCardClick(card3);
            });
            it('should flip the 3rd card', function() {
              return expect(card3.flipped).toBe(true);
            });
            it('should not mark any of the 3 cards as matched', function() {
              expect(card1.matched).toBe(false);
              expect(card2.matched).toBe(false);
              return expect(card3.matched).toBe(false);
            });
            return it('should unflip the first 2 cards', function() {
              expect(card1.flipped).toBe(false);
              return expect(card2.flipped).toBe(false);
            });
          });
        });
        return describe('and also click on a second matching card', function() {
          beforeEach(function() {
            return pair = ctrl.onCardClick(card1a);
          });
          it('should mark both cards as matched', function() {
            expect(card1.matched).toBe(true);
            return expect(card1a.matched).toBe(true);
          });
          it('should empty out the pair', function() {
            var a, b;
            a = pair[0], b = pair[1];
            expect(a).toBeUndefined();
            return expect(b).toBeUndefined();
          });
          return it('should call win on the gameCtrl instance', function() {
            return expect(scope.gameCtrl.win).toHaveBeenCalled();
          });
        });
      });
      return describe('when the timer is off', function() {
        return it('should not be marked as flipped', function() {
          scope.gameCtrl.timer = false;
          pair = ctrl.onCardClick(card1);
          return expect(card1.flipped).toBe(false);
        });
      });
    });
  });

}).call(this);
