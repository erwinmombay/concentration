app.controller 'GameCtrl', ($scope, LoginService, CardService) ->
  @cardViewModels = []
  @cards = []
  @timer = false
  @numOfCards = 20
  @difficulty =
    easy: 60
    medium: 30
    hard: 15
  @curDifficulty = 'easy'
  @cardMultiplier = 10
  @difficulties = ['easy', 'medium', 'hard']

  # NOTE: i would prefer to use `bind` than fat arrow (as to not create closures)
  # but this is just a quicker solution for now.
  # Also this call is redundant to the one AppCtrl but since our Models
  # cache the response and dont trigger a secondary fetch either this is safe
  # to do so.
  LoginService.getUserAsync().then (user) =>
    user.connections.find().then (connections) =>
      @cardViewModels[0..] = CardService.buildCardViewModels connections

  # [(CardViewModel, CardViewModel)] -> Maybe Int -> [CardViewModel]
  @start = (pairedViewModels, numOfCards = 20) ->
    @timer = true
    @generateCards pairedViewModels, @cards, numOfCards

  @stop = ->
    @timer = false
    @cards.length = 0

  @generateCards = (pairedViewModels, cards, numOfCards) ->
    for pair in pairedViewModels
      item.reset() for item in pair
    shuffledPairs = CardService.shuffle pairedViewModels
    cards[0..] = CardService.shuffle \
      _.flatten shuffledPairs[0...(numOfCards / 2)]

  @win = ->

  @lose = ->

  return this
