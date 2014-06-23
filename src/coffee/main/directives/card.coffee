app.directive 'emCard', ($compile) ->
  transclude: 'element'
  link: ($scope, $elem, $attrs, $transclude) ->

