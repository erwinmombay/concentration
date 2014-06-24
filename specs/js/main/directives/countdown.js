(function() {
  describe('emCountdown: ', function() {
    var $timeout, endSpy, moduleName, scope, time, tmpl, view, _ref;
    moduleName = 'concentration';
    _ref = [], $timeout = _ref[0], view = _ref[1], scope = _ref[2], tmpl = _ref[3], endSpy = _ref[4], time = _ref[5];
    beforeEach(module(moduleName));
    beforeEach(inject(function($compile, _$timeout_, $rootScope) {
      time = 3000;
      window.performance.now = function() {
        return time;
      };
      window.performance.tick = function() {
        return time = time + 1000;
      };
      $timeout = _$timeout_;
      scope = $rootScope.$new();
      tmpl = "<span data-em-countdown=\"run\" data-em-countdown-duration=\"dur\" data-em-countdown-end=\"end()\"></span>";
      scope.run = false;
      scope.dur = 3000;
      scope.end = function() {};
      endSpy = spyOn(scope, 'end');
      view = angular.element(tmpl);
      return $compile(view)(scope);
    }));
    it('should start in a stopped state', function() {
      return expect(view.text()).toBe('');
    });
    return describe('starting the clock', function() {
      beforeEach(function() {
        return scope.run = true;
      });
      it('should append the number of seconds left', function() {
        scope.$apply();
        return expect(view.text()).toBe('2s');
      });
      return describe('counting down', function() {
        var tick;
        tick = function() {
          scope.$apply();
          window.performance.tick();
          return $timeout.flush();
        };
        it('should tick the clock', function() {
          tick();
          expect(view.text()).toBe('3s');
          tick();
          return expect(view.text()).toBe('2s');
        });
        return it('should call the end function', function() {
          tick();
          tick();
          tick();
          return expect(endSpy).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);
