app.factory 'LinkedInModels', (IN, $q) ->

  class LinkedInAdapter

    constructor: ({ query, data } = {}) ->
      { has } = @constructor
      hello = _.extend @, data
      @__query = query
      for own relName, rel of has
        @[relName] = new rel.type()

    __success: (data) ->
      if data.count? and _.isArray data.values
        _.extend @ _.omit data, 'values'
      data

    find: (options) ->
      defer = $q.defer()
      @__query()
        .result defer.resolve.bind defer
        .error defer.reject.bind defer
      defer.promise


  class LinkedInProfiles extends LinkedInAdapter

    find: ->
      super.then (data) ->
        _.map data, (data) -> new LinkedInProfile data: data

  class LinkedInProfile extends LinkedInAdapter

    @has:
      connections:
        type: LinkedInProfiles

  { LinkedInProfile, LinkedInProfiles }
