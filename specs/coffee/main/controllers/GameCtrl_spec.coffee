describe 'GameCtrl: ', ->
  moduleName = 'concentration'
  [$timeout, scope, ctrl, pvm] = []

  beforeEach module moduleName

  beforeEach inject \
  (
    $rootScope
    $controller
    CardService
    Models
    $templateCache
    _$timeout_
  ) ->
    $timeout = _$timeout_
    $templateCache.put 'gameModal.html', '<div></div>'
    scope = $rootScope.$new()
    raw = null
    IN.API.Connections().result (data) ->
      raw = data.values
    IN.API.Connections.$flush()
    models = for data in raw
      new Models.LinkedInProfile data: data, __loaded: true
    pvm = CardService.buildCardViewModels models
    ctrl = $controller 'GameCtrl',
      $scope: scope
    ctrl.cardViewModels = pvm

  describe 'initial state of game controller', ->

    it 'should have the timer set to false', ->
      expect(ctrl.timer).toBe false

    it 'should have 0 cards', ->
      expect(ctrl.cards.length).toBe 0

    it 'should not show the image', ->
      expect(ctrl.showImg).toBe false

    it 'should have 3 levels of difficulty', ->
      expect(ctrl.difficulties).toEqual ['easy', 'medium', 'hard']
      keys = _.keys ctrl.difficulty
      for diff in ctrl.difficulties
        expect diff in keys

    it 'should default to easy difficulty', ->
      expect(ctrl.curDifficulty).toBe 'easy'

    it 'should have 0 matched cards', ->
      expect(ctrl.matchedCards.length).toBe 0

  describe 'starting a game', ->

    beforeEach ->
      ctrl.start()
      $timeout.flush()

    it 'should set the timer to true', ->
      expect(ctrl.timer).toBe true

    it 'should have a set of cards', ->
      expect(ctrl.cards.length).not.toBe 0

    describe 'generating cards', ->

      it 'tuple pairs should be flattened', ->
        expect(ctrl.cardViewModels.length).toBe 2
        expect(ctrl.cards.length).toBe 4

    describe 'stopping a game', ->
      beforeEach -> ctrl.stop()

      it 'should set the timer to false', ->
        expect(ctrl.timer).toBe false

      it 'should not empty out the cards', ->
        expect(ctrl.cards.length).toBe 4

  describe 'winning a game', ->

    it 'should pop up a modal', ->
      spy = spyOn ctrl, 'createModal'
      ctrl.win()
      expect(spy).toHaveBeenCalled()

    it 'should call stop', ->
      spy = spyOn ctrl, 'stop'
      modal = ctrl.win()
      scope.$apply()
      modal.close()
      scope.$apply()
      expect(spy).toHaveBeenCalled()

  describe 'losing a game', ->

    it 'should pop up a modal', ->
      spy = spyOn ctrl, 'createModal'
      ctrl.lose()
      expect(spy).toHaveBeenCalled()

    it 'should call stop', ->
      spy = spyOn ctrl, 'stop'
      modal = ctrl.lose()
      scope.$apply()
      modal.close()
      scope.$apply()
      expect(spy).toHaveBeenCalled()
