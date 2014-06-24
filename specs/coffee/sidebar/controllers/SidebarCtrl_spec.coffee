describe 'SidebarCtrl: ', ->
  moduleName = 'concentration'
  [scope, ctrl] = []

  beforeEach module moduleName

  beforeEach inject \
  (
    $rootScope
    $controller
  ) ->
    scope = $rootScope.$new()
    cardViewModels = Array(20)
    scope.gameCtrl =
      difficulty:
        easy: 10
      numOfCards: 10
      cardViewModels: cardViewModels
    ctrl = $controller 'SidebarCtrl',
      $scope: scope

  describe 'increasing the card count', ->
    beforeEach -> ctrl.increaseCards 10

    it 'should increase the number of cards', ->
      expect(scope.gameCtrl.numOfCards).toBe 20

    it 'shouldnt when its over the cardviewmodels count', ->
      ctrl.increaseCards 10
      expect(scope.gameCtrl.numOfCards).not.toBe 20

    describe 'decreasing the number of cards', ->
      beforeEach -> ctrl.decreaseCards 10

      it 'should decrease the the card count', ->
        expect(scope.gameCtrl.numOfCards).toBe 10

      it 'shouldnt when its going to go below 10', ->
        expect(scope.gameCtrl.numOfCards).toBe 10
        ctrl.decreaseCards 10
        expect(scope.gameCtrl.numOfCards).toBe 10

  describe 'getting the duration', ->

    it 'should compute the correct number of ms', ->
      dur = ctrl.getDuration 10, 30
      expect(dur).toBe 30000

    it 'should default to the game difficulty multiplier', ->
      dur = ctrl.getDuration 10
      expect(dur).toBe 10000
