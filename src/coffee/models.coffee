app.factory 'Models', (IN, $q) ->

  window.store = {}

  cache = (name, instance) ->
    if not instance.__collection
      store[name] ?= {}
      if instance.id?
        store[name][instance.id] = instance

  class ApiModel

    constructor: ({ query, data, @__loaded } = {}) ->
      { has } = @constructor
      _.extend @, data
      @__query = query
      for own relName, rel of has
        @[relName] = new rel.type query: rel.query
      cache @constructor.name, @
      @__initState()

    __initState: ->
      @__cache = null
      @__defer = $q.defer()
      @__loaded ?= false

    __success: (defer, data) ->
      if @constructor.collection
        debugger
      if data._count? and _.isArray data.values
        data = data.values
        _.extend @, data
      @__loaded = true
      defer.resolve data

    find: (options = {}) ->
      options = _.defaults options, count: 200
      # FIXME: the static version should of the method on the class
      # should really be the one doing the caching here not the instance
      # method.
      unless @__loaded
        @__query()
          .params options
          .result @__success.bind @, @__defer
          .error @__defer.reject.bind @__defer
      @__defer.promise

    value: -> @__cache

  class LinkedInProfiles extends ApiModel

    notPrivatePredicate = (profile) -> profile.id isnt 'private'

    @collection: true

    find: ->
      super.then (profiles) ->
        profiles = _.filter profiles, notPrivatePredicate
        @__cache = _.map profiles, (profile) ->
          new LinkedInProfile data: profile, __loaded: true

  class LinkedInProfile extends ApiModel

    @has:
      connections:
        type: LinkedInProfiles
        query: IN.API.Connections.bind IN.API, 'me'

  { LinkedInProfile, LinkedInProfiles }
