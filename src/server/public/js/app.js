(function() {
  var app,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = angular.module('concentration', ['ngAnimate', 'fx.animations', 'ui.bootstrap.modal']);

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
    this.appReady = false;
    _.extend(this, LoginService);
    LoginService.getUserAsync().then((function(_this) {
      return function(user) {
        return user.connections.find().then(function(connections) {
          return _this.appReady = true;
        });
      };
    })(this));
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

  app.controller('CardsCtrl', function($scope, $timeout) {
    var cardTimers, cleanUpCards, gameCtrl, isMatch, matches, pair, resetPair, setUpCardTimer;
    gameCtrl = $scope.gameCtrl;
    pair = [];
    matches = [];
    cardTimers = [];
    isMatch = function(a, b) {
      return a.id === b.id && a.type !== b.type;
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
      return pair.slice(0);
    };
    cleanUpCards = function(gameTimer) {
      var cardTimer, _i, _len;
      for (_i = 0, _len = cardTimers.length; _i < _len; _i++) {
        cardTimer = cardTimers[_i];
        $timeout.cancel(cardTimer);
      }
      return cardTimers.length = pair.length = matches.length = 0;
    };
    setUpCardTimer = function(card) {
      return $timeout(function() {
        if (__indexOf.call(pair, card) >= 0) {
          return resetPair.apply(null, pair);
        }
      }, 1500);
    };
    this.onCardClick = function(card) {
      var a, b;
      if (!gameCtrl.timer) {
        return pair.slice(0);
      }
      if (__indexOf.call(matches, card) >= 0) {
        return resetPair.apply(null, pair);
      }
      if (__indexOf.call(pair, card) >= 0 && pair.length === 1) {
        return resetPair.apply(null, pair);
      }
      if (pair.length === 2) {
        if (__indexOf.call(pair, card) >= 0) {
          return resetPair.apply(null, pair);
        }
        resetPair.apply(null, pair);
      }
      card.flipped = true;
      pair.push(card);
      if (pair.length === 2) {
        if (isMatch.apply(null, pair)) {
          a = pair[0], b = pair[1];
          a.matched = b.matched = true;
          matches.push.apply(matches, pair);
          if (matches.length === $scope.gameCtrl.cards.length) {
            $scope.gameCtrl.win();
          }
          return resetPair();
        }
      }
      if (gameCtrl.curDifficulty === 'hard') {
        setUpCardTimer(card);
      }
      return pair.slice(0);
    };
    $scope.$watch('gameCtrl.timer', cleanUpCards);
    $scope.$on('$destroy', cleanUpCards);
    return this;
  });

  app.controller('GameCtrl', function($scope, LoginService, CardService, $modal) {
    this.cardViewModels = [];
    this.cards = [];
    this.timer = false;
    this.numOfCards = 20;
    this.difficulty = {
      easy: 60,
      medium: 30,
      hard: 15
    };
    this.curDifficulty = 'easy';
    this.cardMultiplier = 10;
    this.difficulties = ['easy', 'medium', 'hard'];
    LoginService.getUserAsync().then((function(_this) {
      return function(user) {
        return user.connections.find().then(function(connections) {
          var _ref;
          return ([].splice.apply(_this.cardViewModels, [0, 9e9].concat(_ref = CardService.buildCardViewModels(connections))), _ref);
        });
      };
    })(this));
    this.start = function(pairedViewModels, numOfCards) {
      if (numOfCards == null) {
        numOfCards = 20;
      }
      this.timer = true;
      return this.generateCards(pairedViewModels, this.cards, numOfCards);
    };
    this.stop = function() {
      this.timer = false;
      return this.cards.length = 0;
    };
    this.generateCards = function(pairedViewModels, cards, numOfCards) {
      var item, pair, shuffledPairs, _i, _j, _len, _len1, _ref;
      for (_i = 0, _len = pairedViewModels.length; _i < _len; _i++) {
        pair = pairedViewModels[_i];
        for (_j = 0, _len1 = pair.length; _j < _len1; _j++) {
          item = pair[_j];
          item.reset();
        }
      }
      shuffledPairs = CardService.shuffle(pairedViewModels);
      return ([].splice.apply(cards, [0, 9e9].concat(_ref = CardService.shuffle(_.flatten(shuffledPairs.slice(0, numOfCards / 2))))), _ref);
    };
    this.win = function() {};
    this.lose = function() {};
    return this;
  });

  app.directive('emCard', function($compile) {
    return {
      transclude: 'element',
      link: function($scope, $elem, $attrs, $transclude) {}
    };
  });

  app.directive('emCountdown', function($timeout) {
    return {
      scope: {
        emCountdown: '=',
        emCountdownDuration: '&',
        emCountdownEnd: '&?'
      },
      link: function($scope, $elem, $attrs) {
        var appendSeconds, clock, now, stopClock, tickClock, _ref;
        clock = null;
        now = ((_ref = window.performance) != null ? _ref.now : void 0) != null ? window.performance.now.bind(window.performance) : _.now;
        appendSeconds = (function($elem, ms) {
          var s;
          s = (ms / 1000) | 0;
          $elem.text("" + s + "s");
        }).bind(null, $elem);
        tickClock = function(startTime, left, duration) {
          if (duration == null) {
            duration = 60000;
          }
          stopClock(clock);
          appendSeconds(left);
          left = duration - (now() - startTime);
          if (left <= 0) {
            $scope.$apply(function() {
              $scope.emCountdown = false;
              return $scope.emCountdownEnd();
            });
            return;
          }
          return clock = $timeout(tickClock.bind(null, startTime, left, duration), 1000, false);
        };
        stopClock = function(clock) {
          if (clock != null) {
            $timeout.cancel(clock);
          }
          return clock = null;
        };
        $scope.$watch('emCountdown', function(newVal, oldVal, scope) {
          var duration;
          if (!!newVal) {
            duration = scope.emCountdownDuration();
            return clock = tickClock(now(), duration, duration);
          } else {
            return stopClock(clock);
          }
        });
        return $scope.$on('$destroy', stopClock);
      }
    };
  });

  app.factory('CardService', function() {
    var CardViewModel, buildCardViewModel, fisherYates;
    CardViewModel = (function() {
      function CardViewModel(type, data) {
        this.type = type != null ? type : 'info';
        if (data == null) {
          data = {};
        }
        _.extend(this, data);
        this.cid = "" + this.type + this.id;
        this.title = this.headline;
        this.imgSrc = this.pictureUrl;
        delete this.headline;
        delete this.pictureUrl;
        this.fullName = "" + this.firstName + " " + this.lastName;
        this.flipped = false;
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
      return new CardViewModel(type, profile.toJSON());
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

      ApiModel.prototype.toJSON = function() {
        return _.clone(this);
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

  app.controller('SidebarCtrl', function($scope) {
    var gameCtrl;
    gameCtrl = $scope.gameCtrl;
    this.instructions = "Instructions: Difficulty settings control a certain multipler\nusing the number of cards which ends up as the duration of the game.\nThe \"hard\" difficulty also closes the flipped over card (or the pair)\nafter a couple of seconds.";
    this.getDuration = function(numOfCards, difficulty) {
      if (numOfCards == null) {
        numOfCards = 0;
      }
      if (difficulty == null) {
        difficulty = this.difficulty.easy;
      }
      return (Math.ceil((numOfCards / 10) * difficulty)) * 1000;
    };
    this.increaseCards = function(count) {
      if ((gameCtrl.numOfCards + count) >= (gameCtrl.cardViewModels.length * 2)) {
        return;
      }
      return gameCtrl.numOfCards += count;
    };
    this.decreaseCards = function(count) {
      if (gameCtrl.numOfCards <= 10) {
        return;
      }
      return gameCtrl.numOfCards -= count;
    };
    this.isDifficultyBtnActive = function(difficulty) {
      return gameCtrl.curDifficulty === difficulty;
    };
    this.setDifficulty = function(difficulty) {
      if (gameCtrl.timer) {
        return;
      }
      return gameCtrl.curDifficulty = difficulty;
    };
    this.getDifficultyBtnState = function(diff) {
      return {
        active: this.isDifficultyBtnActive(diff),
        "btn-default": !this.isDifficultyBtnActive(diff),
        "btn-primary": this.isDifficultyBtnActive(diff),
        disabled: gameCtrl.timer
      };
    };
    return this;
  });

}).call(this);
