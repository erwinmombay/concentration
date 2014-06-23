app.controller 'GameCtrl', ($scope, LoginService, CardService) ->
  @cards = []
  @timer = false
  @numberOfConnections = 20

  #createCards = ((profile) ->
    #cards = []
    #for profile in profiles
      #cards.push.call @cards, profile, profile
    #@cards = CardService.shuffle cards
  #).bind @

  @numberOfCards = (connections) ->
    connections * 2

  @duration = (numOfCards = 0) ->
    (Math.ceil (numOfCards / 10) * 15) * 1000

  @increaseCards = ->

  @start = ->
    @timer = true

  @stop = ->
    @timer = false

  #LoginService.getUserProfileAsync().then createCards

  return this
