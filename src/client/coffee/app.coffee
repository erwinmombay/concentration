app = angular.module 'concentration', ['ngAnimate', 'fx.animations', 'ui.bootstrap']

# some additional simple functional helpers that arent in lodash
_.mixin
  flip: (f) -> (x, y) -> fn y, x
  dot: (x) -> (y) -> y[x]
  not: (x) -> not x


app.controller 'AppCtrl', ($scope, LoginService) ->
  @appReady = false
  _.extend @, LoginService
  # NOTE: i would prefer to use `bind` than fat arrow (as to not create closures)
  # but this is just a quicker solution for now.
  LoginService.getUserAsync().then (user) =>
    user.connections.find().then (connections) =>
      @appReady = true
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
