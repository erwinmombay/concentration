app.controller 'GameModalCtrl', ($scope, $modalInstance, infoText) ->

  $scope.infoText = infoText

  $scope.close = $modalInstance.close.bind $modalInstance

  return
