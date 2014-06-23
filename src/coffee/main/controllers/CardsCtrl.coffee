app.controller 'CardsCtrl', ($scope, LoginService) ->

  pair = []

  @onCardClick = (card) ->

  @cards = []

  #$scope.gameCtrl.generate().then ((profiles) ->
    #@cards[0..] = profiles
  #).bind @

  return this
