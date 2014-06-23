app.directive 'emCountdown', ($interval, $parse) ->
  scope:
    emCountdown: '='
    emCountdownDuration: '&'
  link: ($scope, $elem, $attrs) ->
    clock = null

    runClock = (duration = 60000) ->
      start = _.now()
      duration = duration / 1000
      left = duration - (((_.now() - start) / 1000) | 0)
      $elem.text left
      $interval ->
        left = duration - (((_.now() - start) / 1000) | 0)
        if left < 0
          $elem.text 0
          $scope.emCountdown = false
          stopClock()
          return
        $elem.text left
      , 1000, 0, false

    stopClock = ->
      $interval.cancel clock
      clock = null

    $scope.$watch 'emCountdown', (newVal, oldVal, scope) ->
      if !!newVal
        clock = runClock scope.emCountdownDuration()
      else stopClock()

    $scope.$on '$destroy', stopClock
