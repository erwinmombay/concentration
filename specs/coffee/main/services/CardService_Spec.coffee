describe 'CardService: ', ->
  moduleName = 'concentration'

  [models, srv] = []

  beforeEach module moduleName

  beforeEach inject (Models, CardService) ->
    srv = CardService
    raw = null
    IN.API.Connections().result (data) ->
      raw = data.values
    IN.API.Connections.$flush()
    models = for data in raw
      new Models.LinkedInProfile data: data, __loaded: true

  it 'should build a pair of view models', ->
    pvm = srv.buildCardViewModels models
    expect(pvm.length).toBe 2
    expect(pvm[0].length).toBe 2
