app.controller 'SidebarCtrl', ($scope) ->
  { gameCtrl } = $scope

  @instructions = """
      Difficulty settings control a certain multipler using the number of cards which
      ends up as the duration of the game.
      The "hard" difficulty also closes the flipped over card after a couple of seconds.
  """

  # Int -> Int -> Int
  @getDuration = (numOfCards = 0, difficulty = @difficulty.easy) ->
    (Math.ceil (numOfCards / 10) * difficulty) * 1000

  @increaseCards = (count) ->
    return if (@numOfCards + count) >= (gameCtrl.cardViewModels.length * 2)
    @numOfCards += count

  @decreaseCards = (count) ->
    return if @numOfCards <= 10
    @numOfCards -= count

  @isDifficultyBtnActive = (difficulty) ->
    gameCtrl.curDifficulty is difficulty

  @setDifficulty = (difficulty) ->
    return if gameCtrl.timer
    gameCtrl.curDifficulty = difficulty

  return this
