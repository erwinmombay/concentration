app.factory 'Models', (IN, $q) ->

  store = {}

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
      @__pending = false
      return

    # Defer -> Json -> ()
    __success: (defer, data) ->
      if data._count? and _.isArray data.values
        data = data.values
        _.extend @, data
      @__loaded = true
      @__pending = false
      defer.resolve data
      return

    # Defer -> Error -> ()
    __failure: (defer, err) ->
      @__loaded = @__pending = false
      defer.reject err
      return

    # Maybe Object -> Promise a
    find: (options = {}) ->
      options = _.defaults options, count: 200
      # FIXME: the static version should of the method on the class
      # should really be the one doing the caching here not the instance
      # method.
      unless @__loaded
        @__query()
          .params options
          .result @__success.bind @, @__defer
          .error @__failure.bind @, @__defer
        @__pending = true
      @__defer.promise

    # Object
    value: -> @__cache


  class LinkedInProfiles extends ApiModel

    # LinkedInProfile -> Boolean
    validProfilePredicate = (profile) ->
      profile.id isnt 'private' and profile.pictureUrl?.length

    @collection: true

    # Maybe Object -> Promise [LinkedInProfile]
    find: (options = {}) ->
      super.then (profiles) ->
        profiles = _.filter profiles, validProfilePredicate
        @__cache = _.map profiles, (profile) ->
          new LinkedInProfile data: profile, __loaded: true


  class LinkedInProfile extends ApiModel

    @has:
      connections:
        type: LinkedInProfiles
        query: IN.API.Connections.bind IN.API, 'me'

  { LinkedInProfile, LinkedInProfiles }
