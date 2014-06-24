data =
  _count: 46
  _start: 0
  _total: 47
  values: [
    firstName: "first1"
    headline: "headline1"
    id: "1"
    industry: "industrt1"
    lastName: "last1"
    pictureUrl: "pictureUrl1"
  ,
    firstName: "first2"
    headline: "headline2"
    id: "2"
    industry: "industry2"
    lastName: "last2"
    pictureUrl: "pictureUrl2"
  ]

items = []
Connections = ->
  successCallbacks = []
  rejectCallbacks = []
  obj =
    result: (callback) ->
      successCallbacks.push callback
      obj
    error: (callback) ->
      rejectCallbacks.push callback
      obj
    params: -> obj
    __flush: ->
      for fn in successCallbacks
        fn data

  items.push obj
  obj

Connections.$flush = ->
  item.__flush() for item in items

window.IN = API: Connections: Connections

afterEach -> items.length = 0
