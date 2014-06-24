app.controller 'CardsCtrl', ($scope, $timeout) ->
  { gameCtrl } = $scope

  pair = []
  cardTimers = []

  # CardViewModel -> CardViewModel -> Boolean
  isMatch = (a, b) -> a.id is b.id and a.type isnt b.type

  # Maybe CardViewModel -> Maybe CardViewModel -> ()
  resetPair = (a = {}, b = {}) ->
    a.flipped = b.flipped = false
    pair.length = 0
    return pair[..]

  cleanUpCards = (gameTimer) ->
    for cardTimer in cardTimers
      $timeout.cancel cardTimer
    cardTimers.length = pair.length = gameCtrl.matchedCards.length = 0

  setUpCardTimer = (card) ->
    $timeout ->
      if card in pair
        resetPair pair...
    , 1500

  # CardViewModel -> (CardViewModel, CardViewModel)
  @onCardClick = (card) ->
    return pair[..] unless gameCtrl.timer
    return resetPair pair... if card in gameCtrl.matchedCards
    return resetPair pair... if card in pair and pair.length is 1
    if pair.length is 2
      return resetPair pair... if card in pair
      resetPair pair...

    card.flipped = true
    pair.push card

    if pair.length is 2
      if isMatch pair...
        [a, b] = pair
        a.matched = b.matched = true
        gameCtrl.matchedCards.push pair...
        if gameCtrl.matchedCards.length is gameCtrl.cards.length
          gameCtrl.win()
        return resetPair()
    setUpCardTimer card if gameCtrl.curDifficulty is 'hard'
    pair[..]

  $scope.$watch 'gameCtrl.timer', cleanUpCards
  $scope.$on '$destroy', cleanUpCards

  return this
