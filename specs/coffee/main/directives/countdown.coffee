describe 'emCountdown: ', ->
  moduleName = 'concentration'
  [$timeout, view, scope, tmpl, endSpy, time] = []

  beforeEach module moduleName

  beforeEach inject \
  (
    $compile
    _$timeout_
    $rootScope
  ) ->
    time = 3000
    window.performance.now = -> time
    window.performance.tick = -> time = time + 1000
    $timeout = _$timeout_
    scope = $rootScope.$new()
    tmpl = """<span data-em-countdown="run" data-em-countdown-duration="dur" data-em-countdown-end="end()"></span>"""
    scope.run = false
    scope.dur = 3000
    scope.end = ->
    endSpy = spyOn scope, 'end'

    view = angular.element tmpl
    $compile(view)(scope)

  it 'should start in a stopped state', ->
    expect(view.text()).toBe ''

  describe 'starting the clock', ->
    beforeEach -> scope.run = true

    it 'should append the number of seconds left', ->
      scope.$apply()
      expect(view.text()).toBe '2s'

    describe 'counting down', ->
      tick = ->
        scope.$apply()
        window.performance.tick()
        $timeout.flush()

      it 'should tick the clock', ->
        tick()
        expect(view.text()).toBe '3s'
        tick()
        expect(view.text()).toBe '2s'

      it 'should call the end function', ->
        tick()
        tick()
        tick()
        expect(endSpy).toHaveBeenCalled()
