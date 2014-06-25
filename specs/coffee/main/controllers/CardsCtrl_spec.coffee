describe 'CardsCtrl: ', ->
  moduleName = 'concentration'
  [ctrl, pair, scope, card1, card2, card3, card1a] = []
  card1 = null

  beforeEach module moduleName
  beforeEach inject \
  (
    $controller
    $rootScope
  ) ->
    scope = $rootScope.$new()
    card1 = id: 1, matched: false, flipped: false, type: 'info'
    card2 = id: 2, matched: false, flipped: false
    card3 = id: 3, matched: false, flipped: false
    card1a = id: 1, matched: false, flipped: false, type: 'img'
    scope.gameCtrl =
      cards: [card1, card1a]
      timer: true
      win: ->
      lose: ->
      matchedCards: []
    spyOn scope.gameCtrl, 'win'
    spyOn scope.gameCtrl, 'lose'
    pair = []
    ctrl = $controller 'CardsCtrl',
      $scope: scope

  describe 'clicking on a card', ->
    describe 'when the timer is on', ->
      beforeEach -> pair = ctrl.onCardClick card1

      it 'should be marked flipped', ->
        expect(card1.flipped).toBe true

      it 'should place the card as the 1st item of a pair', ->
        [a, b] = pair
        expect(a).toBe card1
        expect(b).toBeUndefined()

      it 'should unflip the card when you click on the same card twice', ->
        expect(card1.flipped).toBe true
        [a, b] = ctrl.onCardClick card1
        expect(card1.flipped).toBe false
        expect(a).toBeUndefined()
        expect(b).toBeUndefined()

      describe 'and also click on a second non matching card', ->
        beforeEach -> pair = ctrl.onCardClick card2

        it 'should place the 2nd card as the 2nd item in the pair', ->
          [a, b] = pair
          expect(card1).toBe a
          expect(card2).toBe b

        it 'should also flip the 2nd card', ->
          expect(card1.flipped).toBe true
          expect(card2.flipped).toBe true

        it 'should not match when the 2nd card is not the same id as the 1st card', ->
          expect(card1.matched).toBe false
          expect(card2.matched).toBe false

        describe 'clicking on a card that is already in the pair', ->

          it 'should unflip both cards', ->
            ctrl.onCardClick card2
            expect(card1.flipped).toBe false
            expect(card2.flipped).toBe false

          it 'should empty out the pair', ->
            [a, b] = ctrl.onCardClick card2
            expect(a).toBeUndefined()
            expect(b).toBeUndefined()

        describe 'clicking on a 3rd card', ->
          beforeEach -> pair = ctrl.onCardClick card3

          it 'should flip the 3rd card', ->
            expect(card3.flipped).toBe true

          it 'should not mark any of the 3 cards as matched', ->
            expect(card1.matched).toBe false
            expect(card2.matched).toBe false
            expect(card3.matched).toBe false

          it 'should unflip the first 2 cards', ->
            expect(card1.flipped).toBe false
            expect(card2.flipped).toBe false

      describe 'and also click on a second matching card', ->
        beforeEach -> pair = ctrl.onCardClick card1a

        it 'should mark both cards as matched', ->
          expect(card1.matched).toBe true
          expect(card1a.matched).toBe true

        it 'should empty out the pair', ->
          [a, b] = pair
          expect(a).toBeUndefined()
          expect(b).toBeUndefined()

        it 'should call win on the gameCtrl instance', ->
          expect(scope.gameCtrl.win).toHaveBeenCalled()

    describe 'when the timer is off', ->

      it 'should not be marked as flipped', ->
        scope.gameCtrl.timer = false
        pair = ctrl.onCardClick card1
        expect(card1.flipped).toBe false
