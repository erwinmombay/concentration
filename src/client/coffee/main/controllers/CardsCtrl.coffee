app.controller 'CardsCtrl', ($scope, LoginService) ->

  pair = []
  matches = []

  # CardViewModel -> CardViewModel -> Boolean
  isMatch = (a, b) -> a.id is b.id

  # Maybe CardViewModel -> Maybe CardViewModel -> ()
  resetPair = (a = {}, b = {}) ->
    a.flipped = b.flipped = false
    pair.length = 0
    return

  # CardViewModel -> ()
  @onCardClick = (card) ->
    unless $scope.gameCtrl.timer
      resetPair card
      return
    return if card in matches
    if pair.length is 2
      if isMatch pair...
        matches.push pair...
        pair.length = 0
        return
      resetPair pair...
    card.flipped = true
    pair.push card
    return

  $scope.$watch 'gameCtrl.timer', (timer) ->
    pair.length = matches.length = 0

  return this
