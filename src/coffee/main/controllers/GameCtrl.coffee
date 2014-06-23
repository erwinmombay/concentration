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

  @start = ->
    @timer = true
    @cards = CardService.shuffle @cardViewModels
    window.cards = @cards
    console.log @cards
    @cards

  @stop = ->
    @timer = false
    @cards = []

  return this
