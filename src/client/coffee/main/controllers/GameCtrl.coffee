app.controller 'GameCtrl', ($scope, LoginService, CardService) ->
  @cardViewModels = []
  @cards = []
  @timer = false
  @numOfCards = 20

  # NOTE: i would prefer to use `bind` than fat arrow (as to not create closures)
  # but this is just a quicker solution for now.
  LoginService.getUserAsync().then (user) =>
    user.connections.find().then (connections) =>
      @cardViewModels = CardService.buildCardViewModels connections

  @duration = (numOfCards = 0) ->
    (Math.ceil (numOfCards / 10) * 15) * 1000

  @increaseCards = ->

  @decreaseCards = ->

  @start = (viewModels, numOfCards) ->
    @timer = true
    shuffledPairs = CardService.shuffle viewModels
    @cards = CardService.shuffle _.flatten shuffledPairs[0...(numOfCards / 2)]

  @stop = ->
    @timer = false
    @cards = []

  return this
