app.controller 'GameCtrl', ($scope, LoginService, CardService, $modal, $timeout) ->
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
  @matchedCards = []
  @showImg = false
  @imageFxCtr = 0
  @matchAttempts = 0

  resetPairedViewModels = (pairedViewModels) ->
    for pair in pairedViewModels
      item.reset() for item in pair

  # NOTE: i would prefer to use `bind` than fat arrow (as to not create closures)
  # but this is just a quicker solution for now.
  # Also this call is redundant to the one AppCtrl but since our Models
  # cache the response and dont trigger a secondary fetch either this is safe
  # to do so.
  LoginService.getUserAsync().then (user) =>
    user.connections.find().then (connections) =>
      @cardViewModels[0..] = CardService.buildCardViewModels connections

  # Maybe Int -> Maybe [CardViewModel] -> ()
  @start = (numOfCards = 20, cardViewModels = @cardViewModels) ->
    @matchedCards.length = @matchAttempts = @cards.length = 0
    resetPairedViewModels cardViewModels
    @showImg = false
    $timeout (->
      @timer = true
      @cards[0..] = @generateCards cardViewModels, numOfCards
    ).bind @
    return

  # Maybe [CardViewModel] -> ()
  @stop = (cardViewModels = @cardViewModels) ->
    @showImg = false if @matchedCards.length isnt @cards.length
    @timer = false
    @cards
    return

  # [(CardViewModel, CardViewModel)] -> Int [CardViewModel]
  @generateCards = (pairedViewModels, numOfCards) ->
    shuffledPairs = CardService.shuffle pairedViewModels
    CardService.shuffle _.flatten shuffledPairs[0...(numOfCards / 2)]


  @createModal = (text) ->
    modal = $modal.open(
      templateUrl: 'gameModal.html'
      controller: 'GameModalCtrl'
      backdrop: 'static'
      resolve:
        infoText: -> text
    )
    modal.result.then @stop.bind @
    modal

  @win = ->
    @createModal """Congratulations! You get to see doge!"""

  @lose = ->
    @createModal """Aww too bad, times up! You don\'t get to see the image yet :(."""

  $scope.$on 'fade-down enter', (-> @showImg = true).bind @

  return this
