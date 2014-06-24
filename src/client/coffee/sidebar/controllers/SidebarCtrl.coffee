app.controller 'SidebarCtrl', ($scope) ->
  { gameCtrl } = $scope

  @instructions = """
      Instructions: Difficulty settings control a certain multipler
      using the number of cards which ends up as the duration of the game.
      The "hard" difficulty also closes the flipped over card (or the pair)
      after a couple of seconds.
  """

  # Int -> Int -> Int
  @getDuration = (numOfCards = 0, difficulty = @difficulty.easy) ->
    (Math.ceil (numOfCards / 10) * difficulty) * 1000

  # Int -> Int
  @increaseCards = (count) ->
    return if (gameCtrl.numOfCards + count) >= (gameCtrl.cardViewModels.length * 2)
    gameCtrl.numOfCards += count

  # Int -> Int
  @decreaseCards = (count) ->
    return if gameCtrl.numOfCards <= 10
    gameCtrl.numOfCards -= count

  # String -> Boolean
  @isDifficultyBtnActive = (difficulty) ->
    gameCtrl.curDifficulty is difficulty

  # String -> String
  @setDifficulty = (difficulty) ->
    return if gameCtrl.timer
    gameCtrl.curDifficulty = difficulty

  @getDifficultyBtnState = (diff) ->
    active: @isDifficultyBtnActive(diff)
    "btn-default": !@isDifficultyBtnActive(diff)
    "btn-primary": @isDifficultyBtnActive(diff)
    disabled: gameCtrl.timer

  return this
