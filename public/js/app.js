(function() {
  var app;

  app = angular.module('conc', []);

  app.factory('LoginService', function() {
    var user;
    user = null;
    return {
      login: function(userData) {
        return user = userData;
      },
      isLoggedIn: function() {
        return user != null;
      }
    };
  });

  app.value('user', null);

  app.controller('AppCtrl', function($scope, LoginService) {
    this.isLoggedIn = LoginService.isLoggedIn;
    return this;
  });

}).call(this);
