(function() {
  var app,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
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
        defer.resolve(profile);
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
    var isMatch, matches, pair, resetPair;
    pair = [];
    matches = [];
    isMatch = function(a, b) {
      return a.id === b.id;
    };
    resetPair = function(a, b) {
      if (a == null) {
        a = {};
      }
      if (b == null) {
        b = {};
      }
      a.flipped = b.flipped = false;
      pair.length = 0;
    };
    this.onCardClick = function(card) {
      if (!$scope.gameCtrl.timer) {
        resetPair(card);
        return;
      }
      if (__indexOf.call(matches, card) >= 0) {
        return;
      }
      if (pair.length === 2) {
        if (isMatch.apply(null, pair)) {
          matches.push.apply(matches, pair);
          pair.length = 0;
          return;
        }
        resetPair.apply(null, pair);
      }
      card.flipped = true;
      pair.push(card);
    };
    $scope.$watch('gameCtrl.timer', function(timer) {
      return pair.length = matches.length = 0;
    });
    return this;
  });

  app.controller('GameCtrl', function($scope, LoginService, CardService) {
    this.cardViewModels = [];
    this.cards = [];
    this.timer = false;
    this.numOfCards = 20;
    this.difficulty = {
      easy: 60,
      medium: 30,
      hard: 15
    };
    LoginService.getUserAsync().then((function(_this) {
      return function(user) {
        return user.connections.find().then(function(connections) {
          var _ref;
          return ([].splice.apply(_this.cardViewModels, [0, 9e9].concat(_ref = CardService.buildCardViewModels(connections))), _ref);
        });
      };
    })(this));
    this.duration = function(numOfCards, difficulty) {
      if (numOfCards == null) {
        numOfCards = 0;
      }
      if (difficulty == null) {
        difficulty = this.difficulty.easy;
      }
      return (Math.ceil((numOfCards / 10) * difficulty)) * 1000;
    };
    this.increaseCards = function() {};
    this.decreaseCards = function() {};
    this.start = function(pairedViewModels, numOfCards) {
      var item, pair, shuffledPairs, _i, _j, _len, _len1, _ref;
      if (numOfCards == null) {
        numOfCards = 20;
      }
      for (_i = 0, _len = pairedViewModels.length; _i < _len; _i++) {
        pair = pairedViewModels[_i];
        for (_j = 0, _len1 = pair.length; _j < _len1; _j++) {
          item = pair[_j];
          item.reset();
        }
      }
      this.timer = true;
      shuffledPairs = CardService.shuffle(pairedViewModels);
      return ([].splice.apply(this.cards, [0, 9e9].concat(_ref = CardService.shuffle(_.flatten(shuffledPairs.slice(0, numOfCards / 2))))), _ref);
    };
    this.stop = function() {
      this.timer = false;
      return this.cards.lenth = 0;
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
          $elem.text("" + left + "s");
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
        this.matched = false;
      }

      CardViewModel.prototype.reset = function() {
        this.matched = this.flipped = false;
      };

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
        this.__pending = false;
      };

      ApiModel.prototype.__success = function(defer, data) {
        if ((data._count != null) && _.isArray(data.values)) {
          data = data.values;
          _.extend(this, data);
        }
        this.__loaded = true;
        this.__pending = false;
        defer.resolve(data);
      };

      ApiModel.prototype.__failure = function(defer, err) {
        this.__loaded = this.__pending = false;
        defer.reject(err);
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

      LinkedInProfiles.prototype.find = function(options) {
        if (options == null) {
          options = {};
        }
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
