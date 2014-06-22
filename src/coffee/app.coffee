app = angular.module 'conc', []

app.factory 'LoginService', (LinkedInModels) ->
  { LinkedInProfile } = LinkedInModels
  profile = null

  login: (profileData) ->
    profile ?= new LinkedInProfile data: profileData

  getUserProfile: -> profile

  isLoggedIn: -> !!profile

app.controller 'AppCtrl', ($scope, LoginService) ->
  _.extend @, LoginService

app.factory 'IN', -> IN
