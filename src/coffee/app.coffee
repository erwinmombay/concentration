app = angular.module 'concentration', ['ngAnimate', 'fx.animations']

# some additional simple functional helpers that arent in lodash
_.mixin
  flip: (f) -> (x, y) -> fn y, x
  dot: (x) -> (y) -> y[x]
  not: (x) -> not x

app.factory 'LoginService', (Models, $q) ->
  { LinkedInProfile } = Models
  defer = $q.defer()
  loggedIn = false

  login: (profileData) ->
    profile = new LinkedInProfile data: profileData, __loaded: true
    loggedIn = true
    defer.resolve profile

  getUserProfileAsync: -> defer.promise

  isLoggedIn: -> loggedIn

app.controller 'AppCtrl', ($scope, LoginService) ->
  _.extend @, LoginService
  LoginService.getUserProfileAsync().then (profile) ->
    profile.connections.find()
  return this

app.factory 'IN', -> window.IN
