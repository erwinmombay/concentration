app.directive 'emCountdown', ($interval, $parse) ->
  scope:
    emCountdown: '='
    emCountdownDuration: '&'
  link: ($scope, $elem, $attrs) ->
    clock = null

    # jQuery a -> Int -> ()
    appendSeconds = (($elem, left) ->
      $elem.text "#{left}s"
      return
    ).bind null, $elem

    # Int -> Promise
    runClock = (duration = 60000) ->
      start = _.now()
      duration = duration / 1000
      left = duration - (((_.now() - start) / 1000) | 0)
      appendSeconds left
      $interval ->
        left = duration - (((_.now() - start) / 1000) | 0)
        if left < 0
          appendSeconds 0
          $scope.emCountdown = false
          stopClock()
          return
        appendSeconds left
      , 1000, 0, false

    stopClock = ->
      $interval.cancel clock if clock?
      clock = null

    $scope.$watch 'emCountdown', (newVal, oldVal, scope) ->
      if !!newVal
        clock = runClock scope.emCountdownDuration()
      else stopClock()

    $scope.$on '$destroy', stopClock
