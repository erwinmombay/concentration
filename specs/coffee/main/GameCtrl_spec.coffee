describe 'GameCtrl: ', ->
  moduleName = 'concentration'
  [scope, ctrl] = []

  beforeEach module moduleName

  beforeEach inject \
  (
    $rootScope
    $controller
  ) ->
    scope = $rootScope.$new()

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

    beforeEach ->

    it 'should be able to start a new game', ->

  describe 'stopping a game', ->
