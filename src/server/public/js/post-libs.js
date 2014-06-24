/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.10.0 - 2014-01-14
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.transition","ui.bootstrap.modal"]),angular.module("ui.bootstrap.tpls",["template/modal/backdrop.html","template/modal/window.html"]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(a,b,c){function d(a){for(var b in a)if(void 0!==f.style[b])return a[b]}var e=function(d,f,g){g=g||{};var h=a.defer(),i=e[g.animation?"animationEndEventName":"transitionEndEventName"],j=function(){c.$apply(function(){d.unbind(i,j),h.resolve(d)})};return i&&d.bind(i,j),b(function(){angular.isString(f)?d.addClass(f):angular.isFunction(f)?f(d):angular.isObject(f)&&d.css(f),i||h.resolve(d)}),h.promise.cancel=function(){i&&d.unbind(i,j),h.reject("Transition cancelled")},h.promise},f=document.createElement("trans"),g={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},h={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return e.transitionEndEventName=d(g),e.animationEndEventName=d(h),e}]),angular.module("ui.bootstrap.modal",["ui.bootstrap.transition"]).factory("$$stackedMap",function(){return{createNew:function(){var a=[];return{add:function(b,c){a.push({key:b,value:c})},get:function(b){for(var c=0;c<a.length;c++)if(b==a[c].key)return a[c]},keys:function(){for(var b=[],c=0;c<a.length;c++)b.push(a[c].key);return b},top:function(){return a[a.length-1]},remove:function(b){for(var c=-1,d=0;d<a.length;d++)if(b==a[d].key){c=d;break}return a.splice(c,1)[0]},removeTop:function(){return a.splice(a.length-1,1)[0]},length:function(){return a.length}}}}}).directive("modalBackdrop",["$timeout",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",link:function(b){b.animate=!1,a(function(){b.animate=!0})}}}]).directive("modalWindow",["$modalStack","$timeout",function(a,b){return{restrict:"EA",scope:{index:"@",animate:"="},replace:!0,transclude:!0,templateUrl:"template/modal/window.html",link:function(c,d,e){c.windowClass=e.windowClass||"",b(function(){c.animate=!0,d[0].focus()}),c.close=function(b){var c=a.getTop();c&&c.value.backdrop&&"static"!=c.value.backdrop&&b.target===b.currentTarget&&(b.preventDefault(),b.stopPropagation(),a.dismiss(c.key,"backdrop click"))}}}}]).factory("$modalStack",["$transition","$timeout","$document","$compile","$rootScope","$$stackedMap",function(a,b,c,d,e,f){function g(){for(var a=-1,b=n.keys(),c=0;c<b.length;c++)n.get(b[c]).value.backdrop&&(a=c);return a}function h(a){var b=c.find("body").eq(0),d=n.get(a).value;n.remove(a),j(d.modalDomEl,d.modalScope,300,i),b.toggleClass(m,n.length()>0)}function i(){if(k&&-1==g()){var a=l;j(k,l,150,function(){a.$destroy(),a=null}),k=void 0,l=void 0}}function j(c,d,e,f){function g(){g.done||(g.done=!0,c.remove(),f&&f())}d.animate=!1;var h=a.transitionEndEventName;if(h){var i=b(g,e);c.bind(h,function(){b.cancel(i),g(),d.$apply()})}else b(g,0)}var k,l,m="modal-open",n=f.createNew(),o={};return e.$watch(g,function(a){l&&(l.index=a)}),c.bind("keydown",function(a){var b;27===a.which&&(b=n.top(),b&&b.value.keyboard&&e.$apply(function(){o.dismiss(b.key)}))}),o.open=function(a,b){n.add(a,{deferred:b.deferred,modalScope:b.scope,backdrop:b.backdrop,keyboard:b.keyboard});var f=c.find("body").eq(0),h=g();h>=0&&!k&&(l=e.$new(!0),l.index=h,k=d("<div modal-backdrop></div>")(l),f.append(k));var i=angular.element("<div modal-window></div>");i.attr("window-class",b.windowClass),i.attr("index",n.length()-1),i.attr("animate","animate"),i.html(b.content);var j=d(i)(b.scope);n.top().value.modalDomEl=j,f.append(j),f.addClass(m)},o.close=function(a,b){var c=n.get(a).value;c&&(c.deferred.resolve(b),h(a))},o.dismiss=function(a,b){var c=n.get(a).value;c&&(c.deferred.reject(b),h(a))},o.dismissAll=function(a){for(var b=this.getTop();b;)this.dismiss(b.key,a),b=this.getTop()},o.getTop=function(){return n.top()},o}]).provider("$modal",function(){var a={options:{backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$http","$templateCache","$controller","$modalStack",function(b,c,d,e,f,g,h){function i(a){return a.template?d.when(a.template):e.get(a.templateUrl,{cache:f}).then(function(a){return a.data})}function j(a){var c=[];return angular.forEach(a,function(a){(angular.isFunction(a)||angular.isArray(a))&&c.push(d.when(b.invoke(a)))}),c}var k={};return k.open=function(b){var e=d.defer(),f=d.defer(),k={result:e.promise,opened:f.promise,close:function(a){h.close(k,a)},dismiss:function(a){h.dismiss(k,a)}};if(b=angular.extend({},a.options,b),b.resolve=b.resolve||{},!b.template&&!b.templateUrl)throw new Error("One of template or templateUrl options is required.");var l=d.all([i(b)].concat(j(b.resolve)));return l.then(function(a){var d=(b.scope||c).$new();d.$close=k.close,d.$dismiss=k.dismiss;var f,i={},j=1;b.controller&&(i.$scope=d,i.$modalInstance=k,angular.forEach(b.resolve,function(b,c){i[c]=a[j++]}),f=g(b.controller,i)),h.open(k,{scope:d,deferred:e,content:a[0],backdrop:b.backdrop,keyboard:b.keyboard,windowClass:b.windowClass})},function(a){e.reject(a)}),l.then(function(){f.resolve(!0)},function(){f.reject(!1)}),k},k}]};return a}),angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(a){a.put("template/modal/backdrop.html",'<div class="modal-backdrop fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1040 + index*10}"></div>')}]),angular.module("template/modal/window.html",[]).run(["$templateCache",function(a){a.put("template/modal/window.html",'<div tabindex="-1" class="modal fade {{ windowClass }}" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog"><div class="modal-content" ng-transclude></div></div>\n</div>')}]);
/*
 AngularJS v1.2.18
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(u,f,P){'use strict';f.module("ngAnimate",["ng"]).factory("$$animateReflow",["$$rAF","$document",function(f,u){return function(e){return f(function(){e()})}}]).config(["$provide","$animateProvider",function(W,H){function e(f){for(var e=0;e<f.length;e++){var h=f[e];if(h.nodeType==aa)return h}}function C(h){return f.element(e(h))}var n=f.noop,h=f.forEach,Q=H.$$selectors,aa=1,k="$$ngAnimateState",K="ng-animate",g={running:!0};W.decorator("$animate",["$delegate","$injector","$sniffer","$rootElement",
"$$asyncCallback","$rootScope","$document",function(y,u,$,L,F,I,P){function R(a){if(a){var b=[],c={};a=a.substr(1).split(".");($.transitions||$.animations)&&b.push(u.get(Q[""]));for(var d=0;d<a.length;d++){var f=a[d],e=Q[f];e&&!c[f]&&(b.push(u.get(e)),c[f]=!0)}return b}}function M(a,b,c){function d(a,b){var c=a[b],d=a["before"+b.charAt(0).toUpperCase()+b.substr(1)];if(c||d)return"leave"==b&&(d=c,c=null),t.push({event:b,fn:c}),l.push({event:b,fn:d}),!0}function e(b,d,f){var q=[];h(b,function(a){a.fn&&
q.push(a)});var m=0;h(q,function(b,e){var h=function(){a:{if(d){(d[e]||n)();if(++m<q.length)break a;d=null}f()}};switch(b.event){case "setClass":d.push(b.fn(a,p,A,h));break;case "addClass":d.push(b.fn(a,p||c,h));break;case "removeClass":d.push(b.fn(a,A||c,h));break;default:d.push(b.fn(a,h))}});d&&0===d.length&&f()}var w=a[0];if(w){var k="setClass"==b,g=k||"addClass"==b||"removeClass"==b,p,A;f.isArray(c)&&(p=c[0],A=c[1],c=p+" "+A);var B=a.attr("class")+" "+c;if(T(B)){var r=n,v=[],l=[],x=n,m=[],t=[],
B=(" "+B).replace(/\s+/g,".");h(R(B),function(a){!d(a,b)&&k&&(d(a,"addClass"),d(a,"removeClass"))});return{node:w,event:b,className:c,isClassBased:g,isSetClassOperation:k,before:function(a){r=a;e(l,v,function(){r=n;a()})},after:function(a){x=a;e(t,m,function(){x=n;a()})},cancel:function(){v&&(h(v,function(a){(a||n)(!0)}),r(!0));m&&(h(m,function(a){(a||n)(!0)}),x(!0))}}}}}function z(a,b,c,d,e,w,g){function n(d){var e="$animate:"+d;x&&(x[e]&&0<x[e].length)&&F(function(){c.triggerHandler(e,{event:a,
className:b})})}function p(){n("before")}function A(){n("after")}function B(){n("close");g&&F(function(){g()})}function r(){r.hasBeenRun||(r.hasBeenRun=!0,w())}function v(){if(!v.hasBeenRun){v.hasBeenRun=!0;var d=c.data(k);d&&(l&&l.isClassBased?D(c,b):(F(function(){var d=c.data(k)||{};z==d.index&&D(c,b,a)}),c.data(k,d)));B()}}var l=M(c,a,b);if(l){b=l.className;var x=f.element._data(l.node),x=x&&x.events;d||(d=e?e.parent():c.parent());var m=c.data(k)||{};e=m.active||{};var t=m.totalActive||0,u=m.last;
if(l.isClassBased&&(m.disabled||u&&!u.isClassBased)||N(c,d))r(),p(),A(),v();else{d=!1;if(0<t){m=[];if(l.isClassBased)"setClass"==u.event?(m.push(u),D(c,b)):e[b]&&(y=e[b],y.event==a?d=!0:(m.push(y),D(c,b)));else if("leave"==a&&e["ng-leave"])d=!0;else{for(var y in e)m.push(e[y]),D(c,y);e={};t=0}0<m.length&&h(m,function(a){a.cancel()})}!l.isClassBased||(l.isSetClassOperation||d)||(d="addClass"==a==c.hasClass(b));if(d)r(),p(),A(),B();else{if("leave"==a)c.one("$destroy",function(a){a=f.element(this);var b=
a.data(k);b&&(b=b.active["ng-leave"])&&(b.cancel(),D(a,"ng-leave"))});c.addClass(K);var z=O++;t++;e[b]=l;c.data(k,{last:l,active:e,index:z,totalActive:t});p();l.before(function(d){var e=c.data(k);d=d||!e||!e.active[b]||l.isClassBased&&e.active[b].event!=a;r();!0===d?v():(A(),l.after(v))})}}}else r(),p(),A(),v()}function U(a){if(a=e(a))a=f.isFunction(a.getElementsByClassName)?a.getElementsByClassName(K):a.querySelectorAll("."+K),h(a,function(a){a=f.element(a);(a=a.data(k))&&a.active&&h(a.active,function(a){a.cancel()})})}
function D(a,b){if(e(a)==e(L))g.disabled||(g.running=!1,g.structural=!1);else if(b){var c=a.data(k)||{},d=!0===b;!d&&(c.active&&c.active[b])&&(c.totalActive--,delete c.active[b]);if(d||!c.totalActive)a.removeClass(K),a.removeData(k)}}function N(a,b){if(g.disabled)return!0;if(e(a)==e(L))return g.disabled||g.running;do{if(0===b.length)break;var c=e(b)==e(L),d=c?g:b.data(k),d=d&&(!!d.disabled||d.running||0<d.totalActive);if(c||d)return d;if(c)break}while(b=b.parent());return!0}var O=0;L.data(k,g);I.$$postDigest(function(){I.$$postDigest(function(){g.running=
!1})});var V=H.classNameFilter(),T=V?function(a){return V.test(a)}:function(){return!0};return{enter:function(a,b,c,d){a=f.element(a);b=b&&f.element(b);c=c&&f.element(c);this.enabled(!1,a);y.enter(a,b,c);I.$$postDigest(function(){a=C(a);z("enter","ng-enter",a,b,c,n,d)})},leave:function(a,b){a=f.element(a);U(a);this.enabled(!1,a);I.$$postDigest(function(){z("leave","ng-leave",C(a),null,null,function(){y.leave(a)},b)})},move:function(a,b,c,d){a=f.element(a);b=b&&f.element(b);c=c&&f.element(c);U(a);
this.enabled(!1,a);y.move(a,b,c);I.$$postDigest(function(){a=C(a);z("move","ng-move",a,b,c,n,d)})},addClass:function(a,b,c){a=f.element(a);a=C(a);z("addClass",b,a,null,null,function(){y.addClass(a,b)},c)},removeClass:function(a,b,c){a=f.element(a);a=C(a);z("removeClass",b,a,null,null,function(){y.removeClass(a,b)},c)},setClass:function(a,b,c,d){a=f.element(a);a=C(a);z("setClass",[b,c],a,null,null,function(){y.setClass(a,b,c)},d)},enabled:function(a,b){switch(arguments.length){case 2:if(a)D(b);else{var c=
b.data(k)||{};c.disabled=!0;b.data(k,c)}break;case 1:g.disabled=!a;break;default:a=!g.disabled}return!!a}}}]);H.register("",["$window","$sniffer","$timeout","$$animateReflow",function(k,g,C,L){function F(a,E){S&&S();X.push(E);S=L(function(){h(X,function(a){a()});X=[];S=null;q={}})}function I(a,E){var b=e(a);a=f.element(b);Y.push(a);b=Date.now()+E;b<=ea||(C.cancel(da),ea=b,da=C(function(){K(Y);Y=[]},E,!1))}function K(a){h(a,function(a){(a=a.data(m))&&(a.closeAnimationFn||n)()})}function R(a,E){var b=
E?q[E]:null;if(!b){var c=0,d=0,e=0,f=0,m,Z,s,g;h(a,function(a){if(a.nodeType==aa){a=k.getComputedStyle(a)||{};s=a[J+B];c=Math.max(M(s),c);g=a[J+r];m=a[J+v];d=Math.max(M(m),d);Z=a[p+v];f=Math.max(M(Z),f);var b=M(a[p+B]);0<b&&(b*=parseInt(a[p+l],10)||1);e=Math.max(b,e)}});b={total:0,transitionPropertyStyle:g,transitionDurationStyle:s,transitionDelayStyle:m,transitionDelay:d,transitionDuration:c,animationDelayStyle:Z,animationDelay:f,animationDuration:e};E&&(q[E]=b)}return b}function M(a){var b=0;a=
f.isString(a)?a.split(/\s*,\s*/):[];h(a,function(a){b=Math.max(parseFloat(a)||0,b)});return b}function z(a){var b=a.parent(),c=b.data(x);c||(b.data(x,++ca),c=ca);return c+"-"+e(a).getAttribute("class")}function U(a,b,c,d){var f=z(b),h=f+" "+c,k=q[h]?++q[h].total:0,g={};if(0<k){var l=c+"-stagger",g=f+" "+l;(f=!q[g])&&b.addClass(l);g=R(b,g);f&&b.removeClass(l)}d=d||function(a){return a()};b.addClass(c);var l=b.data(m)||{},s=d(function(){return R(b,h)});d=s.transitionDuration;f=s.animationDuration;if(0===
d&&0===f)return b.removeClass(c),!1;b.data(m,{running:l.running||0,itemIndex:k,stagger:g,timings:s,closeAnimationFn:n});a=0<l.running||"setClass"==a;0<d&&D(b,c,a);0<f&&(0<g.animationDelay&&0===g.animationDuration)&&(e(b).style[p]="none 0s");return!0}function D(a,b,c){"ng-enter"!=b&&("ng-move"!=b&&"ng-leave"!=b)&&c?a.addClass(t):e(a).style[J+r]="none"}function N(a,b){var c=J+r,d=e(a);d.style[c]&&0<d.style[c].length&&(d.style[c]="");a.removeClass(t)}function O(a){var b=p;a=e(a);a.style[b]&&0<a.style[b].length&&
(a.style[b]="")}function V(a,b,c,f){function g(a){b.off(z,l);b.removeClass(p);d(b,c);a=e(b);for(var fa in t)a.style.removeProperty(t[fa])}function l(a){a.stopPropagation();var b=a.originalEvent||a;a=b.$manualTimeStamp||b.timeStamp||Date.now();b=parseFloat(b.elapsedTime.toFixed(Q));Math.max(a-y,0)>=x&&b>=u&&f()}var k=e(b);a=b.data(m);if(-1!=k.getAttribute("class").indexOf(c)&&a){var p="";h(c.split(" "),function(a,b){p+=(0<b?" ":"")+a+"-active"});var n=a.stagger,s=a.timings,r=a.itemIndex,u=Math.max(s.transitionDuration,
s.animationDuration),v=Math.max(s.transitionDelay,s.animationDelay),x=v*ba,y=Date.now(),z=A+" "+H,q="",t=[];if(0<s.transitionDuration){var B=s.transitionPropertyStyle;-1==B.indexOf("all")&&(q+=w+"transition-property: "+B+";",q+=w+"transition-duration: "+s.transitionDurationStyle+";",t.push(w+"transition-property"),t.push(w+"transition-duration"))}0<r&&(0<n.transitionDelay&&0===n.transitionDuration&&(q+=w+"transition-delay: "+T(s.transitionDelayStyle,n.transitionDelay,r)+"; ",t.push(w+"transition-delay")),
0<n.animationDelay&&0===n.animationDuration&&(q+=w+"animation-delay: "+T(s.animationDelayStyle,n.animationDelay,r)+"; ",t.push(w+"animation-delay")));0<t.length&&(s=k.getAttribute("style")||"",k.setAttribute("style",s+"; "+q));b.on(z,l);b.addClass(p);a.closeAnimationFn=function(){g();f()};k=(r*(Math.max(n.animationDelay,n.transitionDelay)||0)+(v+u)*W)*ba;a.running++;I(b,k);return g}f()}function T(a,b,c){var d="";h(a.split(","),function(a,e){d+=(0<e?",":"")+(c*b+parseInt(a,10))+"s"});return d}function a(a,
b,c,e){if(U(a,b,c,e))return function(a){a&&d(b,c)}}function b(a,b,c,e){if(b.data(m))return V(a,b,c,e);d(b,c);e()}function c(c,d,e,f){var g=a(c,d,e);if(g){var h=g;F(d,function(){N(d,e);O(d);h=b(c,d,e,f)});return function(a){(h||n)(a)}}f()}function d(a,b){a.removeClass(b);var c=a.data(m);c&&(c.running&&c.running--,c.running&&0!==c.running||a.removeData(m))}function G(a,b){var c="";a=f.isArray(a)?a:a.split(/\s+/);h(a,function(a,d){a&&0<a.length&&(c+=(0<d?" ":"")+a+b)});return c}var w="",J,H,p,A;u.ontransitionend===
P&&u.onwebkittransitionend!==P?(w="-webkit-",J="WebkitTransition",H="webkitTransitionEnd transitionend"):(J="transition",H="transitionend");u.onanimationend===P&&u.onwebkitanimationend!==P?(w="-webkit-",p="WebkitAnimation",A="webkitAnimationEnd animationend"):(p="animation",A="animationend");var B="Duration",r="Property",v="Delay",l="IterationCount",x="$$ngAnimateKey",m="$$ngAnimateCSS3Data",t="ng-animate-block-transitions",Q=3,W=1.5,ba=1E3,q={},ca=0,X=[],S,da=null,ea=0,Y=[];return{enter:function(a,
b){return c("enter",a,"ng-enter",b)},leave:function(a,b){return c("leave",a,"ng-leave",b)},move:function(a,b){return c("move",a,"ng-move",b)},beforeSetClass:function(b,c,d,e){var f=G(d,"-remove")+" "+G(c,"-add"),g=a("setClass",b,f,function(a){var e=b.attr("class");b.removeClass(d);b.addClass(c);a=a();b.attr("class",e);return a});if(g)return F(b,function(){N(b,f);O(b);e()}),g;e()},beforeAddClass:function(b,c,d){var e=a("addClass",b,G(c,"-add"),function(a){b.addClass(c);a=a();b.removeClass(c);return a});
if(e)return F(b,function(){N(b,c);O(b);d()}),e;d()},setClass:function(a,c,d,e){d=G(d,"-remove");c=G(c,"-add");return b("setClass",a,d+" "+c,e)},addClass:function(a,c,d){return b("addClass",a,G(c,"-add"),d)},beforeRemoveClass:function(b,c,d){var e=a("removeClass",b,G(c,"-remove"),function(a){var d=b.attr("class");b.removeClass(c);a=a();b.attr("class",d);return a});if(e)return F(b,function(){N(b,c);O(b);d()}),e;d()},removeClass:function(a,c,d){return b("removeClass",a,G(c,"-remove"),d)}}}])}])})(window,
window.angular);
//# sourceMappingURL=angular-animate.min.js.map


(function(angular){
  "use strict";

  angular.module('fx.animations.assist', [])

  .factory('Assist', ['$filter', '$window', '$timeout', function ($filter, $window, $timeout){
    return {

      emit: function(element, animation, motion){
        var $scope = angular.element(element).scope();
        $scope.$emit(animation + ' ' +motion);
      },

      parseClassList: function(element){
        var ease,
            list    = element[0].classList,
            results = {trigger: false, duration: 0.3, ease: $window.Back};

        angular.forEach(list, function (className){
          if(className.slice(0,9) === 'fx-easing'){
            ease = className.slice(10);
            results.ease = $window[$filter('cap')(ease)] ? $window[$filter('cap')(ease)] : $window.Elastic;
          }
          if(className === 'fx-trigger'){
            results.trigger = true;
          }
          if(className.slice(0,8) === 'fx-speed'){
            results.duration = parseInt(className.slice(9))/1000;
          }
        });
        return results;
      },

      addTimer: function(options, element, end){
        var self = this;
        var time = options.stagger ? (options.duration * 3) * 1000 : options.duration * 1000;
        var timer = $timeout(function(){
          if(options.trigger){
            self.emit(element, options.animation, options.motion);
          }
          end();
        }, time);
        element.data(options.timeoutKey, timer);
      },

      removeTimer: function(element, timeoutKey, timer){
        $timeout.cancel(timer);
        element.removeData(timeoutKey);
      }
    };
  }])

  .filter('cap', [function(){
    return function (input){
      return input.charAt(0).toUpperCase() + input.slice(1);
    };
  }]);
}(angular));
(function(angular, TweenMax, TimelineMax){
  "use strict";
  var timeoutKey = '$$fxTimer';
  angular.module('fx.animations.create', ['fx.animations.assist'])

  .factory('FadeAnimation', ['$timeout', '$window', 'Assist', function ($timeout, $window, Assist){
    return function (effect){
      var inEffect        = effect.enter,
          outEffect       = effect.leave,
          outEffectLeave  = effect.inverse || effect.leave,
          fx_type         = effect.animation;

      this.enter = function(element, done){
        var options = Assist.parseClassList(element);
        options.motion = 'enter';
        options.animation = fx_type;
        options.timeoutKey = timeoutKey;
        Assist.addTimer(options, element, done);
        inEffect.ease = options.ease.easeOut;
        TweenMax.set(element, outEffect);
        TweenMax.to(element, options.duration, inEffect);
        return function (canceled){
          var timer = element.data(timeoutKey);
          if(canceled){
            if(timer){
              Assist.removeTimer(element, timeoutKey, timer);
            }
          }
        };
      };

      this.leave = function(element, done){
        var options = Assist.parseClassList(element);
        options.motion = 'leave';
        options.animation = fx_type;
        options.timeoutKey = timeoutKey;
        Assist.addTimer(options, element, done);
        outEffectLeave.ease = options.ease.easeIn;
        TweenMax.set(element, inEffect);
        TweenMax.to(element, options.duration, outEffectLeave);
        return function (canceled){
          var timer = element.data(timeoutKey);
          if(canceled){
            if(timer){
              Assist.removeTimer(element, timeoutKey, timer);
            }
          }
        };
      };

      this.move = this.enter;

      this.addClass = function(element, className, done){
        if(className === 'ng-hide'){
          var options = Assist.parseClassList(element);
          options.motion = 'enter';
          options.animation = fx_type;
          options.timeoutKey = timeoutKey;
          Assist.addTimer(options, element, done);
          TweenMax.to(element, options.duration, outEffectLeave);
          return function (canceled){
            if(canceled){
              var timer = element.data(timeoutKey);
              if(timer){
                Assist.removeTimer(element, timeoutKey, timer);
              }
            }
          };
        } else {
          done();
        }
      };

      this.removeClass = function(element, className, done){
        if(className === 'ng-hide'){
          var options = Assist.parseClassList(element);
          options.motion = 'leave';
          options.animation = fx_type;
          options.timeoutKey = timeoutKey;
          TweenMax.set(element, outEffect);
          TweenMax.to(element, options.duration, inEffect);
          return function (canceled){
            if(canceled){
              var timer = element.data(timeoutKey);
              if(timer){
                Assist.removeTimer(element, timeoutKey, timer);
              }
            }
          };
        } else {
          done();
        }
      };
    };
  }])

  .factory('BounceAnimation', ['$timeout', '$window', 'Assist', function ($timeout, $window, Assist){
    return function (effect){
      var start       = effect.first,
          mid         = effect.mid,
          third       = effect.third,
          end         = effect.end,
          fx_type     = effect.animation,
          startTime   = 0.1;


      this.enter = function(element, done){
        var options = Assist.parseClassList(element);
        options.motion = 'enter';
        options.animation = fx_type;
        options.timeoutKey = timeoutKey;
        options.stagger = true;
        Assist.addTimer(options, element, done);
        var enter = new TimelineMax();
        enter.to(element, 0.01, start);
        enter.to(element, options.duration, mid);
        enter.to(element, options.duration, third);
        enter.to(element, options.duration, end);
        return function (canceled){
          if(canceled){
            var timer = element.data(timeoutKey);
            if(timer){
              Assist.removeTimer(element, timeoutKey, timer);
            }
          }
        };
      };

      this.leave = function(element, done){
        var options = Assist.parseClassList(element);
        options.motion = 'leave';
        options.animation = fx_type;
        options.timeoutKey = timeoutKey;
        options.stagger = true;
        Assist.addTimer(options, element, done);
        var leave = new TimelineMax();
        leave.to(element, startTime, end);
        leave.to(element, options.duration, third);
        leave.to(element, options.duration, mid);
        leave.to(element, options.duration, start);
        return function (canceled){
          if(canceled){
            var timer = element.data(timeoutKey);
            if(timer){
              Assist.removeTimer(element, timeoutKey, timer);
            }
          }
        };
      };

      this.move = this.enter;

      this.addClass = function(element, className, done){
        if(className === 'ng-hide'){
          var options = Assist.parseClassList(element);
          options.motion = 'enter';
          options.animation = fx_type;
          options.timeoutKey = timeoutKey;
          Assist.addTimer(options, element, done);
          var bac = new TimelineMax();
          bac.to(element, startTime, end);
          bac.to(element, options.duration, third);
          bac.to(element, options.duration, mid);
          bac.to(element, options.duration, start);
          return function (canceled){
            if(canceled){
              var timer = element.data(timeoutKey);
              if(timer){
                Assist.removeTimer(element, timeoutKey, timer);
              }
            }
          };
        } else {
          done();
        }
      };

      this.removeClass = function(element, className, done){
        if(className === 'ng-hide'){
          var options = Assist.parseClassList(element);
          options.motion = 'leave';
          options.animation = fx_type;
          options.timeoutKey = timeoutKey;
          var rc = new TimelineMax();
          rc.to(element, startTime, start);
          rc.to(element, options.duration, mid);
          rc.to(element, options.duration, third);
          rc.to(element, options.duration, end);
          return function (canceled){
            if(canceled){
              var timer = element.data(timeoutKey);
              if(timer){
                Assist.removeTimer(element, timeoutKey, timer);
              }
            }
          };
        } else {
          done();
        }
      };
    };
  }])

  .factory('RotateAnimation', ['$timeout', '$window', 'Assist', function ($timeout, $window, Assist){
    return function (effect){
      var start       = effect.start,
          end         = effect.end,
          leaveEnd    = effect.inverse,
          fx_type     = effect.animation;

      this.enter = function(element, done){
        var options = Assist.parseClassList(element);
            options.motion = 'enter';
            options.animation = fx_type;
            options.timeoutKey = timeoutKey;

        end.ease = options.ease.easeOut;
        Assist.addTimer(options, element, done);
        TweenMax.set(element, start);
        TweenMax.to(element, options.duration, end);
        return function (canceled){
          if(canceled){
            var timer = element.data(timeoutKey);
            if(timer){
              Assist.removeTimer(element, timeoutKey, timer);
            }
          }
        };
      };

      this.leave = function(element, done){
        var options = Assist.parseClassList(element);
            options.motion = 'leave';
            options.animation = fx_type;
            options.timeoutKey = timeoutKey;

        leaveEnd.ease = options.ease.easeIn;
        Assist.addTimer(options, element, done);
        TweenMax.set(element, end);
        TweenMax.to(element, options.duration, leaveEnd);
        return function (canceled){
          if(canceled){
            var timer = element.data(timeoutKey);
            if(timer){
              Assist.removeTimer(element, timeoutKey, timer);
            }
          }
        };
      };

      this.move = this.enter;

      this.addClass = function(element, className, done){
        if(className === 'ng-hide'){
          var options = Assist.parseClassList(element);
          options.motion = 'enter';
          options.animation = fx_type;
          options.timeoutKey = timeoutKey;
          Assist.addTimer(options, element, done);
          TweenMax.set(element, end);
          TweenMax.to(element, options.duration, start);
          return function (canceled){
            if(canceled){
              var timer = element.data(timeoutKey);
              if(timer){
                Assist.removeTimer(element, timeoutKey, timer);
              }
            }
          };
        } else {
          done();
        }
      };

       this.removeClass = function(element, className, done){
        if(className === 'ng-hide'){
          var options = Assist.parseClassList(element);
          options.motion = 'enter';
          options.animation = fx_type;
          options.timeoutKey = timeoutKey;
          Assist.addTimer(options, element, done);
          TweenMax.set(element, start);
          TweenMax.to(element, options.duration, end);
          return function (canceled){
            if(canceled){
              var timer = element.data(timeoutKey);
              if(timer){
                Assist.removeTimer(element, timeoutKey, timer);
              }
            }
          };
        } else {
          done();
        }
      };
    };
  }])

  .factory('ZoomAnimation', ['$timeout', '$window', 'Assist', function ($timeout, $window, Assist){
    return function (effect){
      var start       = effect.start,
          end         = effect.end,
          fx_type     = effect.animation;

      this.enter = function(element, done){
        var options             = Assist.parseClassList(element);
            options.motion      = 'enter';
            options.animation   = fx_type;
            options.timeoutKey  = timeoutKey;
        end.ease = options.ease.easeOut;
        Assist.addTimer(options, element, done);
        TweenMax.set(element, start);
        TweenMax.to(element, options.duration, end);
        return function (canceled){
          if(canceled){
            var timer = element.data(timeoutKey);
            if(timer){
              Assist.removeTimer(element, timeoutKey, timer);
            }
          }
        };
      };

      this.leave = function(element, done){
        var options             = Assist.parseClassList(element);
            options.motion      = 'lave';
            options.animation   = fx_type;
            options.timeoutKey  = timeoutKey;

        start.ease = options.ease.easeIn;
        Assist.addTimer(options, element, done);
        TweenMax.set(element, end);
        TweenMax.to(element, options.duration, start);
        return function (canceled){
          if(canceled){
            var timer = element.data(timeoutKey);
            if(timer){
              Assist.removeTimer(element, timeoutKey, timer);
            }
          }
        };
      };

      this.move = this.enter;

      this.removeClass = function(element, className, done){
        if(className === 'ng-hide'){
          var options = Assist.parseClassList(element);
          options.motion = 'leave';
          options.animation = fx_type;
          options.timeoutKey = timeoutKey;
          Assist.addTimer(options, element, done);
          TweenMax.set(element, start);
          TweenMax.to(element, options.duration, end);
          return function (canceled){
            if(canceled){
              var timer = element.data(timeoutKey);
              if(timer){
                Assist.removeTimer(element, timeoutKey, timer);
              }
            }
          };
        } else {
          done();
        }
      };

      this.addClass = function(element, className, done){
        if(className === 'ng-hide'){
          var options = Assist.parseClassList(element);
          options.motion = 'enter';
          options.animation = fx_type;
          options.timeoutKey = timeoutKey;
          Assist.addTimer(options, element, done);
          TweenMax.set(element, end);
          TweenMax.to(element, options.duration, start);
          return function (canceled){
            if(canceled){
              var timer = element.data(timeoutKey);
              if(timer){
                Assist.removeTimer(element, timeoutKey, timer);
              }
            }
          };
        } else {
          done();
        }
      };
    };
  }])
  .factory('Flip3d', ['$window', function ($window){
    return function (effect){
      var axis = effect.axis;
      var flipType = 'fx-flip'+axis;
      this.addClass = function(el, className, done){
        var wrapper = angular.element(el.children()[0]);
        var myDone = function(){
          return done();
        };
        if(className === flipType){
          effect.transform.ease = $window.Bounce.easeOut;
          effect.transform.onComplete = myDone;
          TweenMax.to(wrapper, effect.duration, effect.transform);
        } else {
          done();
        }
      };

      this.removeClass = function(el, className, done){
        var wrapper = angular.element(el.children()[0]);
        var myDone = function(){
          return done();
        };
        if(className === flipType){
          effect.reset.ease = $window.Bounce.easeOut;
          effect.reset.onComplete = myDone;
          TweenMax.to(wrapper, effect.duration, effect.reset);
        } else {
          done();
        }
      };
    };
  }]);
}(angular, TweenMax, TimelineMax));



/*
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Using Angular's '.animate', all fade animations are created with javaScript.

    @BounceAnimation
      Constructor function that returns a new animation object that has all
      required methods for ngAnimate ex: this.enter(), this.leave(), etc

    @effect
      The actual animation that will be applied to the element, staggered
       first: the style to applied to the element 1/4 through the animtion
       mid: style to be applied to to the element 2/4 through the animation
       third: style to be applied to the element 3/4 through the animation
       end: style to be applied to the element when it's complete
       animation: the name of the animtion for the eventing system
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

*/

(function(angular){
  "use strict";

  angular.module('fx.animations.bounces', ['fx.animations.create'])

  .animation('.fx-bounce-normal', ['BounceAnimation', function (BounceAnimation){
    var effect = {
      first: {opacity: 0, transform: 'scale(.3)'},
      mid: {opacity: 1, transform: 'scale(1.05)'},
      third: {transform: 'scale(.9)'},
      end: {opacity: 1, transform: 'scale(1)'},
      animation: 'bounce-normal'
    };

    return new BounceAnimation(effect);
  }])

  .animation('.fx-bounce-down', ['BounceAnimation', function (BounceAnimation){
    var effect = {
      first: {opacity: 0, transform: 'translateY(-2000px)'},
      mid: {opacity: 1, transform: 'translateY(30px)'},
      third: {transform: 'translateY(-10px)'},
      end: {transform: 'translateY(0)'},
      animation: 'bounce-down'
    };


    return new BounceAnimation(effect);
  }])

  .animation('.fx-bounce-left', ['BounceAnimation', function (BounceAnimation){
    var effect = {
      first: {opacity: 0,  transform: 'translateX(-2000px)'},
      mid: {opacity: 1, transform: 'translateX(30px)'},
      third: {transform: 'translateX(-10px)'},
      end: {transform: 'translateX(0)'},
      animation: 'bounce-left'
    };

    return new BounceAnimation(effect);
  }])

  .animation('.fx-bounce-up', ['BounceAnimation', function (BounceAnimation) {
    var effect = {
      first: {opacity: 0,   transform: 'translateY(2000px)'},
      mid: {opacity: 1, transform: 'translateY(-30px)'},
      third: {transform: 'translateY(10px)'},
      end: {transform: 'translateY(0)'},
      animation: 'bounce-up'
    };
    return new BounceAnimation(effect);
  }])

  .animation('.fx-bounce-right', ['BounceAnimation', function (BounceAnimation) {
    var effect = {
      first: {opacity: 0,   transform: 'translateX(2000px)'},
      mid: {opacity: 1, transform: 'translateX(-30px)'},
      third: {transform: 'translateX(10px)'},
      end: {transform: 'translateX(0)'},
      animation: 'bounce-right'
    };
    return new BounceAnimation(effect);
  }]);
}(angular));

/*
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Using Angular's '.animate', all fade animations are created with javaScript.

    @FadeAnimation
      Constructor function that returns a new animation object that has all
      required methods for ngAnimate ex: this.enter(), this.leave(), etc

    @effect
      The actual animation that will be applied to the element
       enter: style to be applied when angular triggers the enter event
       leave: style to be applied when angular triggers the leave event
       inverse: style to be appiled to offset the enter event
       animation: the name of the animtion for the eventing system
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

*/


(function(angular){
  "use strict";

  angular.module('fx.animations.fades', ['fx.animations.create'])

  .animation('.fx-fade-normal', ['FadeAnimation', function (FadeAnimation){
    var effect = {
      enter: {opacity: 1},
      leave: {opacity: 0},
      animation: 'fade-normal'
    };
    return new FadeAnimation(effect);
  }])


  .animation('.fx-fade-down', ['FadeAnimation', function (FadeAnimation){
    var effect = {
      enter: {opacity: 1, transform: 'translateY(0)'},
      leave: {opacity: 0, transform: 'translateY(-20px)'},
      inverse: {opacity: 0, transform: 'translateY(20px)'},
      animation: 'fade-down'
    };
    return new FadeAnimation(effect);
  }])

  .animation('.fx-fade-down-big', ['FadeAnimation', function (FadeAnimation){
    var effect = {
      enter: {opacity: 1, transform: 'translateY(0)'},
      leave: {opacity: 0, transform: 'translateY(-2000px)'},
      inverse: {opacity: 0, transform: 'translateY(2000px)'},
      animation: 'fade-down-big'
    };
    return new FadeAnimation(effect);
  }])

  .animation('.fx-fade-left', ['FadeAnimation', function (FadeAnimation){
    var effect = {
      enter: {opacity: 1, transform: 'translateX(0)'},
      leave: {opacity: 0, transform: 'translateX(-20px)'},
      inverse: {opacity: 0, transform: 'translateX(20px)'},
      animation: 'fade-left'
    };
    return new FadeAnimation(effect);
  }])

  .animation('.fx-fade-left-big', ['FadeAnimation', function (FadeAnimation){
    var effect = {
      enter: {opacity: 1, transform: 'translateX(0)'},
      leave: {opacity: 0, transform: 'translateX(-2000px)'},
      inverse: {opacity: 0, transform: 'translateX(2000px)'},
      animation: 'fade-left-big'
    };

    return new FadeAnimation(effect);
  }])

  .animation('.fx-fade-right', ['FadeAnimation', function (FadeAnimation){
    var effect = {
      enter: {opacity: 1, transform: 'translateX(0)'},
      leave: {opacity: 0, transform:'translateX(20px)'},
      inverse: {opacity: 0, transform: 'translateX(-20px)'},
      animation: 'fade-right'
    };

    return new FadeAnimation(effect);
  }])

  .animation('.fx-fade-right-big', ['FadeAnimation', function (FadeAnimation){
    var effect = {
      enter: {opacity: 1, transform: 'translateX(0)'},
      leave: {opacity: 0, transform:'translateX(2000px)'},
      inverse: {opacity: 0, transform: 'translateX(-2000px)'},
      animation: 'fade-right-big'
    };

    return new FadeAnimation(effect);
  }])

  .animation('.fx-fade-up', ['FadeAnimation', function (FadeAnimation){
    var effect = {
      enter: {opacity: 1, transform: 'translateY(0)'},
      leave: {opacity: 0, transform:'translateY(20px)'},
      inverse: {opacity: 0, transform: 'translateY(-20px)'},
      animation: 'fade-up'
    };

    return new FadeAnimation(effect);
  }])

  .animation('.fx-fade-up-big', ['FadeAnimation', function (FadeAnimation){
    var effect = {
      enter: {opacity: 1, transform: 'translateY(0)'},
      leave: {opacity: 0, transform:'translateY(2000px)'},
      inverse: {opacity: 0, transform: 'translateY(-2000px)'},
      animation: 'fade-up-big'
    };

    return new FadeAnimation(effect);
  }]);
}(angular));

/*
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Using Angular's '.animate', all fade animations are created with javaScript.

    @BounceAnimation
      Constructor function that returns a new animation object that has all
      required methods for ngAnimate ex: this.enter(), this.leave(), etc

    @effect
      The actual animation that will be applied to the element, staggered
       first: the style to applied to the element 1/4 through the animtion
       mid: style to be applied to to the element 2/4 through the animation
       third: style to be applied to the element 3/4 through the animation
       end: style to be applied to the element when it's complete
       animation: the name of the animtion for the eventing system
  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

*/

(function(angular){
  "use strict";

  angular.module('fx.animations.rotations', ['fx.animations.create'])

  .animation('.fx-rotate-counterclock', ['RotateAnimation', function(RotateAnimation){
    var effect = {
      start: {opacity: 0, transformOrigin: 'center center', transform: 'rotate(-200deg)'},
      end: {opacity: 1, transformOrigin: 'center center', transform: 'rotate(0)'},
      inverse: {opacity: 0, transformOrigin: 'center center', transform: 'rotate(200deg)'},
      animation: 'rotate-counterclock'
    };
    return new RotateAnimation(effect);
  }])

  .animation('.fx-rotate-clock', ['RotateAnimation', function(RotateAnimation){
    var effect = {
      start: {opacity: 0, transformOrigin: 'center center', transform: 'rotate(200deg)'},
      end: {opacity: 1, transformOrigin: 'center center', transform: 'rotate(0)'},
      inverse: {opacity: 0, transformOrigin: 'center center', transform: 'rotate(-200deg)'},
      animation: 'rotate-clock'
    };
    return new RotateAnimation(effect);
  }])
  .animation('.fx-rotate-clock-left', ['RotateAnimation', function(RotateAnimation){
    var effect = {
      start: {opacity: 0, transformOrigin: 'left bottom', transform: 'rotate(-90deg)'},
      end: {opacity: 1, transformOrigin: 'left bottom', transform: 'rotate(0)'},
      inverse: {opacity: 0, transformOrigin: 'left bottom', transform: 'rotate(90deg)'},
      animation: 'rotate-clock-left'
    };
    return new RotateAnimation(effect);
  }])
  .animation('.fx-rotate-counterclock-right', ['RotateAnimation', function(RotateAnimation){
    var effect = {
      start: {opacity: 0, transformOrigin: 'right bottom', transform: 'rotate(90deg)'},
      end: {opacity: 1, transformOrigin: 'right bottom', transform: 'rotate(0)'},
      inverse: {opacity: 0, transformOrigin: 'right bottom', transform: 'rotate(-90deg)'},
      animation: 'rotate-counterclock-right'
    };
    return new RotateAnimation(effect);
  }])
  .animation('.fx-rotate-counterclock-up', ['RotateAnimation', function(RotateAnimation){
    var effect = {
      start: {opacity: 0, transformOrigin: 'left bottom', transform: 'rotate(90deg)'},
      end: {opacity: 1, transformOrigin: 'left bottom', transform: 'rotate(0)'},
      inverse: {opacity: 0, transformOrigin: 'left bottom', transform: 'rotate(-90deg)'},
      animation: 'rotate-counterclock-up'
    };
    return new RotateAnimation(effect);
  }])
  .animation('.fx-rotate-clock-up', ['RotateAnimation', function(RotateAnimation){
    var effect = {
      start: {opacity: 0, transformOrigin: 'right bottom', transform: 'rotate(-90deg)'},
      end: {opacity: 1, transformOrigin: 'right bottom', transform: 'rotate(0)'},
      inverse: {opacity: 0, transformOrigin: 'right bottom', transform: 'rotate(90deg)'},
      animation: 'rotate-clock-up'
    };
    return new RotateAnimation(effect);
  }]);

}(angular));
(function(angular){
  "use strict";

  angular.module('fx.animations.zooms', ['fx.animations.create'])

  .animation('.fx-zoom-normal', ['ZoomAnimation', function (ZoomAnimation){
    var effect = {
      start: {opacity: 0, transform: 'scale(.3)'},
      end: {opacity: 1, transform: 'scale(1)'},
      animation: 'zoom-normal'
    };

    return new ZoomAnimation(effect);
  }])

  .animation('.fx-zoom-down', ['ZoomAnimation', function (ZoomAnimation){
    var effect = {
      start: {opacity: 0, transform: 'scale(.1) translateY(-2000px)'},
      end: {opacity: 1, transform: 'scale(1) translateY(0)'},
      animation: 'zoom-down'
    };

    return new ZoomAnimation(effect);
  }])

  .animation('.fx-zoom-up', ['ZoomAnimation', function (ZoomAnimation){
    var effect = {
      start: {opacity: 0, transform: "scale(.1) translateY(2000px)"},
      end: {opacity: 1, transform: "scale(1) translateY(0)"},
      animation: 'zoom-up'
    };

    return new ZoomAnimation(effect);
  }])

  .animation('.fx-zoom-right', ['ZoomAnimation', function (ZoomAnimation){
    var effect = {
      start: {opacity: 0, transform: 'scale(.1) translateX(2000px)'},
      end: {opacity: 1, transform: 'scale(1) translateX(0)'},
      animation: 'zoom-right'
    };

    return new ZoomAnimation(effect);
  }])

  .animation('.fx-zoom-left', ['ZoomAnimation', function (ZoomAnimation){
    var effect = {
      start: {opacity: 0, transform: 'scale(.1) translateX(-2000px)'},
      end: {opacity: 1, transform: 'scale(1) translateX(0)'},
      animation: 'zoom-left'
    };

    return new ZoomAnimation(effect);
  }]);
}(angular));
(function (angular) {
  "use strict";
  angular.module('fx.events.flip', ['fx.animations.create'])

  .animation('.fx-flipY', ['Flip3d' ,function (Flip3d){
    var effect = {
      transform: {transform:'rotate3d(0,1,0,180deg)'},
      reset: {transform:'rotateY(0)'},
      axis: 'Y',
      duration: 0.8
    };
    return new Flip3d(effect);
  }])

  .animation('.fx-flipX', ['Flip3d' ,function (Flip3d){
    var effect = {
      transform: {transform:'rotate3d(1,0,0,180deg)'},
      reset: {transform:'rotateX(0)'},
      axis: 'X',
      duration: 0.8
    };
    return new Flip3d(effect);
  }])

  .animation('.fx-flipZ', ['Flip3d' ,function (Flip3d){
    var effect = {
      transform: {transform:'rotate3d(0,0,1,180deg)'},
      reset: {transform:'rotateZ(0)'},
      axis: 'Z',
      duration: 0.8
    };
    return new Flip3d(effect);
  }]);
}(angular));
(function(angular, TweenMax){
  "use strict";
  angular.module('fx.directives.flips', [])

  .directive('fxFlip', ['$animate', function($animate){
    function postlink(scope, el, attr){
      var front,
          back,
          wrapper = angular.element(el.children()[0]),
          events = attr.fxFlip.split(' '),
          axis = attr.axis.toUpperCase();

      angular.forEach(el.children().children(), function(child){
        child = angular.element(child);
        if(child.hasClass('fx-front')){front = child;}
        if(child.hasClass('fx-back')) {back = child;}
      });

      back.css({position: 'absolute', width: '100%', height: '100%'});
      front.css({position: 'absolute', width: '100%', height: '100%'});

      TweenMax.set(el, {perspective: 800, border: 'solid 2px black'});
      TweenMax.set(wrapper, {transformStyle: 'preserve-3d', width: '100%', height: '100%'});
      TweenMax.set(back, {transform: 'rotate3d(0,1,0,-180deg)'});
      TweenMax.set([back, front], {backfaceVisibility: 'hidden'});

      angular.forEach(events, function(event){
        scope.$on('next', function(){
          if(el.hasClass('fx-flip'+axis)){
            $animate.removeClass(el, 'fx-flip'+axis);
          } else {
            $animate.addClass(el, 'fx-flip'+axis);
          }
        });
      });
    }
    return {
      replace: true,
      transclude: true,
      scope: true,
      template:
        '<div ng-transclude></div>',
      link: postlink
    };
  }]);
}(angular, TweenMax));
// Collect all the animations into one master module. this module is the main module

(function(angular){
  "use strict";
  angular.module('fx.animates',
    ['fx.animations.fades',
      'fx.animations.bounces',
      'fx.animations.rotations',
      'fx.animations.zooms',
      'fx.events.flip']
  );
  angular.module('fx.directives',
    ['fx.directives.flips']
  );

  angular.module('fx.animations', ['fx.animates', 'fx.directives']);
}(angular));

