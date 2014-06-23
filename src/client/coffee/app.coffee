app = angular.module 'concentration', ['ngAnimate', 'fx.animations']

# some additional simple functional helpers that arent in lodash
_.mixin
  flip: (f) -> (x, y) -> fn y, x
  dot: (x) -> (y) -> y[x]
  not: (x) -> not x

app.controller 'AppCtrl', ($scope, LoginService) ->
  _.extend @, LoginService
  LoginService.getUserAsync().then (user) ->
    user.connections.find()
  return this

app.factory 'LoginService', (Models, $q) ->
  { LinkedInProfile } = Models
  defer = $q.defer()
  loggedIn = false

  login: (profileData) ->
    profile = new LinkedInProfile data: profileData, __loaded: true
    loggedIn = true
    defer.resolve profile

  getUserAsync: -> defer.promise

  isLoggedIn: -> loggedIn

app.factory 'IN', -> window.IN
