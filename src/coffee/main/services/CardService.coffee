app.factory 'CardService', ->
  class CardViewModel
    constructor: (@id, @type = 'info', @fullName = '', @title = '', @imgSrc = '', @flipped = false) ->
      @cid = "#{@type}#{@id}"

  fisherYates = (a) ->
    i = a.length
    while --i > 0
      j = ~~(Math.random() * (i + 1))
      t = a[j]
      a[j] = a[i]
      a[i] = t
    a

  buildCardViewModel = (profile, type = 'info') ->
    new CardViewModel(
        profile.id
        type
        "#{profile.firstName} #{profile.lastName}"
        profile.headline
        profile.pictureUrl
    )

  shuffle: (cards) -> fisherYates cards[..]

  buildCardViewModels: (linkedInProfiles) ->
    viewModels = []
    for profile in linkedInProfiles
      info = buildCardViewModel profile, 'info'
      img = buildCardViewModel profile, 'img'
      viewModels.push.call viewModels, info, img
    viewModels

