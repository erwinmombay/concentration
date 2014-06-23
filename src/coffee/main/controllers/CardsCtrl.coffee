app.controller 'CardsCtrl', ($scope, LoginService) ->

  pair = []

  isMatch = (a, b) ->
    a.id is b.id

  resetPair = (a, b) ->
    a.flipped = b.flipped = false
    pair.length = 0

  @onCardClick = (card) ->
    if pair.length is 2
      unless isMatch pair...
        resetPair pair...
      else pair.length = 0

    card.flipped = true
    pair.push card

  @img =
    'background-img': 'img/1.jpg'

  return this
