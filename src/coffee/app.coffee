app = angular.module 'conc', []

app.factory 'LoginService', ->
  user = null
  login: (userData) ->
    user = userData

  isLoggedIn: -> user?

app.value 'user', null

app.controller 'AppCtrl', ($scope, LoginService) ->
  @isLoggedIn = LoginService.isLoggedIn

  return @
