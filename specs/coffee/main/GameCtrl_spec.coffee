describe 'GameCtrl: ', ->
  moduleName = 'concentration'
  [scope, ctrl, pvm] = []

  beforeEach module moduleName

  beforeEach inject \
  (
    $rootScope
    $controller
    CardService
    Models
  ) ->
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

    beforeEach -> ctrl.start()

    it 'should set the timer to true', ->
      expect(ctrl.timer).toBe true

    it 'should generated a shuffled set of cards', ->

  describe 'stopping a game', ->

  describe 'resetting a game', ->

  describe 'winning a game', ->

  describe ' losing a game', ->
