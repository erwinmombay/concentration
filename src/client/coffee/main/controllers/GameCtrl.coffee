app.controller 'GameCtrl', ($scope, LoginService, CardService) ->
  @gameReady = false
  @cardViewModels = []
  @cards = []
  @timer = false
  @numOfCards = 20
  @difficulty =
    easy: 60
    medium: 30
    hard: 15
  @curDifficulty = @difficulty.easy


  # NOTE: i would prefer to use `bind` than fat arrow (as to not create closures)
  # but this is just a quicker solution for now.
  LoginService.getUserAsync().then (user) =>
    user.connections.find().then (connections) =>
      @gameReady = true
      @cardViewModels[0..] = CardService.buildCardViewModels connections

  # Int -> Int -> Int
  @duration = (numOfCards = 0, difficulty = @difficulty.easy) ->
    (Math.ceil (numOfCards / 10) * difficulty) * 1000

  @increaseCards = ->

  @decreaseCards = ->

  # [(CardViewModel, CardViewModel)] -> Maybe Int -> [CardViewModel]
  @start = (pairedViewModels, numOfCards = 20) ->
    @timer = true
    for pair in pairedViewModels
      item.reset() for item in pair
    shuffledPairs = CardService.shuffle pairedViewModels
    @cards[0..] = CardService.shuffle _.flatten shuffledPairs[0...(numOfCards / 2)]

  @stop = ->
    @timer = false
    @cards.length = 0

  return this
