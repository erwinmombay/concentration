app = angular.module 'concentration', ['ngAnimate', 'fx.animations']

# some additional simple functional helpers that arent in lodash
_.mixin
  flip: (f) -> (x, y) -> fn y, x
  dot: (x) -> (y) -> y[x]
  not: (x) -> not x


app.controller 'AppCtrl', ($scope, LoginService) ->
  _.extend @, LoginService
  LoginService.getUserAsync().then (user) ->
    user.connections.find().then (connections) ->
  return this


app.factory 'LoginService', (Models, $q) ->
  { LinkedInProfile } = Models
  defer = $q.defer()
  loggedIn = false

  # Json -> ()
  login: (profileData) ->
    profile = new LinkedInProfile data: profileData, __loaded: true
    loggedIn = true
    defer.resolve profile
    return

  # Promise LinkedInProfile
  getUserAsync: -> defer.promise

  # Boolean
  isLoggedIn: -> loggedIn


app.factory 'IN', -> window.IN
