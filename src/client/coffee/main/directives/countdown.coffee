app.directive 'emCountdown', ($timeout) ->
  scope:
    emCountdown: '='
    emCountdownDuration: '&'
    emCountdownEnd: '&?'
  link: ($scope, $elem, $attrs) ->
    clock = null
    now =
      if window.performance?.now?
        window.performance.now.bind window.performance
      else _.now

    # jQuery a -> Int -> ()
    appendSeconds = (($elem, ms) ->
      s = (ms / 1000) | 0
      $elem.text "#{s}s"
      return
    ).bind null, $elem

    # NOTE: we use $timeout instead of interval since it calls `evalAsync`
    # and causes a digest loop each time even does invokeApply option is false
    tickClock = (startTime, left, duration = 60000) ->
      stopClock clock
      appendSeconds left
      left = duration - (now() - startTime)
      if left <= 0
        $scope.$apply ->
          $scope.emCountdown = false
          $scope.emCountdownEnd()
        return
      clock = $timeout tickClock.bind(null, startTime, left, duration), 1000, false

    stopClock = (clock) ->
      $timeout.cancel clock if clock?
      clock = null

    $scope.$watch 'emCountdown', (newVal, oldVal, scope) ->
      if !!newVal
        duration = scope.emCountdownDuration()
        return if duration <= 0
        clock = tickClock now(), duration, duration
      else stopClock clock

    $scope.$on '$destroy', stopClock
