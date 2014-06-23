(function() {
  var app,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = angular.module('concentration', ['ngAnimate', 'fx.animations']);

  _.mixin({
    flip: function(f) {
      return function(x, y) {
        return fn(y, x);
      };
    },
    dot: function(x) {
      return function(y) {
        return y[x];
      };
    },
    not: function(x) {
      return !x;
    }
  });

  app.controller('AppCtrl', function($scope, LoginService) {
    _.extend(this, LoginService);
    LoginService.getUserAsync().then(function(user) {
      return user.connections.find();
    });
    return this;
  });

  app.factory('LoginService', function(Models, $q) {
    var LinkedInProfile, defer, loggedIn;
    LinkedInProfile = Models.LinkedInProfile;
    defer = $q.defer();
    loggedIn = false;
    return {
      login: function(profileData) {
        var profile;
        profile = new LinkedInProfile({
          data: profileData,
          __loaded: true
        });
        loggedIn = true;
        return defer.resolve(profile);
      },
      getUserAsync: function() {
        return defer.promise;
      },
      isLoggedIn: function() {
        return loggedIn;
      }
    };
  });

  app.factory('IN', function() {
    return window.IN;
  });

  app.controller('CardsCtrl', function($scope, LoginService) {
    var isMatch, pair, resetPair;
    pair = [];
    isMatch = function(a, b) {
      return a.id === b.id;
    };
    resetPair = function(a, b) {
      a.flipped = b.flipped = false;
      return pair.length = 0;
    };
    this.onCardClick = function(card) {
      if (pair.length === 2) {
        if (!isMatch.apply(null, pair)) {
          resetPair.apply(null, pair);
        } else {
          pair.length = 0;
        }
      }
      card.flipped = true;
      return pair.push(card);
    };
    this.img = {
      'background-img': 'img/1.jpg'
    };
    return this;
  });

  app.controller('GameCtrl', function($scope, LoginService, CardService) {
    this.cardViewModels = [];
    this.cards = [];
    this.timer = false;
    this.numOfCards = 20;
    LoginService.getUserAsync().then((function(_this) {
      return function(user) {
        return user.connections.find().then(function(connections) {
          return _this.cardViewModels = CardService.buildCardViewModels(connections);
        });
      };
    })(this));
    this.duration = function(numOfCards) {
      if (numOfCards == null) {
        numOfCards = 0;
      }
      return (Math.ceil((numOfCards / 10) * 15)) * 1000;
    };
    this.increaseCards = function() {};
    this.decreaseCards = function() {};
    this.start = function(viewModels, numOfCards) {
      var shuffledPairs;
      this.timer = true;
      shuffledPairs = CardService.shuffle(viewModels);
      return this.cards = CardService.shuffle(_.flatten(shuffledPairs.slice(0, numOfCards / 2)));
    };
    this.stop = function() {
      this.timer = false;
      return this.cards = [];
    };
    return this;
  });

  app.directive('emCard', function($compile) {
    return {
      transclude: 'element',
      link: function($scope, $elem, $attrs, $transclude) {}
    };
  });

  app.directive('emCountdown', function($interval, $parse) {
    return {
      scope: {
        emCountdown: '=',
        emCountdownDuration: '&'
      },
      link: function($scope, $elem, $attrs) {
        var appendSeconds, clock, runClock, stopClock;
        clock = null;
        appendSeconds = (function($elem, left) {
          return $elem.text("" + left + "s");
        }).bind(null, $elem);
        runClock = function(duration) {
          var left, start;
          if (duration == null) {
            duration = 60000;
          }
          start = _.now();
          duration = duration / 1000;
          left = duration - (((_.now() - start) / 1000) | 0);
          appendSeconds(left);
          return $interval(function() {
            left = duration - (((_.now() - start) / 1000) | 0);
            if (left < 0) {
              appendSeconds(0);
              $scope.emCountdown = false;
              stopClock();
              return;
            }
            return appendSeconds(left);
          }, 1000, 0, false);
        };
        stopClock = function() {
          if (clock != null) {
            $interval.cancel(clock);
          }
          return clock = null;
        };
        $scope.$watch('emCountdown', function(newVal, oldVal, scope) {
          if (!!newVal) {
            return clock = runClock(scope.emCountdownDuration());
          } else {
            return stopClock();
          }
        });
        return $scope.$on('$destroy', stopClock);
      }
    };
  });

  app.factory('CardService', function() {
    var CardViewModel, buildCardViewModel, fisherYates;
    CardViewModel = (function() {
      function CardViewModel(id, type, fullName, title, imgSrc, flipped) {
        this.id = id;
        this.type = type != null ? type : 'info';
        this.fullName = fullName != null ? fullName : '';
        this.title = title != null ? title : '';
        this.imgSrc = imgSrc != null ? imgSrc : '';
        this.flipped = flipped != null ? flipped : false;
        this.cid = "" + this.type + this.id;
      }

      return CardViewModel;

    })();
    fisherYates = function(a) {
      var i, j, t;
      i = a.length;
      while (--i > 0) {
        j = ~~(Math.random() * (i + 1));
        t = a[j];
        a[j] = a[i];
        a[i] = t;
      }
      return a;
    };
    buildCardViewModel = function(profile, type) {
      if (type == null) {
        type = 'info';
      }
      return new CardViewModel(profile.id, type, "" + profile.firstName + " " + profile.lastName, profile.headline, profile.pictureUrl);
    };
    return {
      shuffle: function(cards) {
        return fisherYates(cards.slice(0));
      },
      buildCardViewModels: function(linkedInProfiles) {
        var img, info, profile, viewModels;
        return viewModels = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = linkedInProfiles.length; _i < _len; _i++) {
            profile = linkedInProfiles[_i];
            info = buildCardViewModel(profile, 'info');
            img = buildCardViewModel(profile, 'img');
            _results.push([info, img]);
          }
          return _results;
        })();
      }
    };
  });

  app.factory('TimerService', function($rootScope) {
    return {
      start: function() {},
      stop: function() {}
    };
  });

  app.factory('Models', function(IN, $q) {
    var ApiModel, LinkedInProfile, LinkedInProfiles, cache, store;
    store = {};
    cache = function(name, instance) {
      if (!instance.__collection) {
        if (store[name] == null) {
          store[name] = {};
        }
        if (instance.id != null) {
          return store[name][instance.id] = instance;
        }
      }
    };
    ApiModel = (function() {
      function ApiModel(_arg) {
        var data, has, query, rel, relName, _ref;
        _ref = _arg != null ? _arg : {}, query = _ref.query, data = _ref.data, this.__loaded = _ref.__loaded;
        has = this.constructor.has;
        _.extend(this, data);
        this.__query = query;
        for (relName in has) {
          if (!__hasProp.call(has, relName)) continue;
          rel = has[relName];
          this[relName] = new rel.type({
            query: rel.query
          });
        }
        cache(this.constructor.name, this);
        this.__initState();
      }

      ApiModel.prototype.__initState = function() {
        this.__cache = null;
        this.__defer = $q.defer();
        if (this.__loaded == null) {
          this.__loaded = false;
        }
        return this.__pending = false;
      };

      ApiModel.prototype.__success = function(defer, data) {
        if ((data._count != null) && _.isArray(data.values)) {
          data = data.values;
          _.extend(this, data);
        }
        this.__loaded = true;
        this.__pending = false;
        return defer.resolve(data);
      };

      ApiModel.prototype.__failure = function(defer, err) {
        this.__loaded = this.__pending = false;
        return defer.reject(err);
      };

      ApiModel.prototype.find = function(options) {
        if (options == null) {
          options = {};
        }
        options = _.defaults(options, {
          count: 200
        });
        if (!this.__loaded) {
          this.__query().params(options).result(this.__success.bind(this, this.__defer)).error(this.__failure.bind(this, this.__defer));
          this.__pending = true;
        }
        return this.__defer.promise;
      };

      ApiModel.prototype.value = function() {
        return this.__cache;
      };

      return ApiModel;

    })();
    LinkedInProfiles = (function(_super) {
      var validProfilePredicate;

      __extends(LinkedInProfiles, _super);

      function LinkedInProfiles() {
        return LinkedInProfiles.__super__.constructor.apply(this, arguments);
      }

      validProfilePredicate = function(profile) {
        var _ref;
        return profile.id !== 'private' && ((_ref = profile.pictureUrl) != null ? _ref.length : void 0);
      };

      LinkedInProfiles.collection = true;

      LinkedInProfiles.prototype.find = function() {
        return LinkedInProfiles.__super__.find.apply(this, arguments).then(function(profiles) {
          profiles = _.filter(profiles, validProfilePredicate);
          return this.__cache = _.map(profiles, function(profile) {
            return new LinkedInProfile({
              data: profile,
              __loaded: true
            });
          });
        });
      };

      return LinkedInProfiles;

    })(ApiModel);
    LinkedInProfile = (function(_super) {
      __extends(LinkedInProfile, _super);

      function LinkedInProfile() {
        return LinkedInProfile.__super__.constructor.apply(this, arguments);
      }

      LinkedInProfile.has = {
        connections: {
          type: LinkedInProfiles,
          query: IN.API.Connections.bind(IN.API, 'me')
        }
      };

      return LinkedInProfile;

    })(ApiModel);
    return {
      LinkedInProfile: LinkedInProfile,
      LinkedInProfiles: LinkedInProfiles
    };
  });

}).call(this);
