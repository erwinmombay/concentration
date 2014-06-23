app.factory 'CardService', ->
  class CardViewModel
    @constructor: (@type = 'info', @fullName = '', @title = '', @imgSrc = '') ->

  fisherYates = (a) ->
    i = a.length
    while --i > 0
      j = ~~(Math.random() * (i + 1))
      t = a[j]
      a[j] = a[i]
      a[i] = t
    a

  shuffle: (cards) -> fisherYates cards[..]

  buildCardViewModels: (linkedInProfiles) ->
    viewModels = []
    for profile in linkedInProfiles
      info = new CardViewModel(
        'info'
        "#{profile.firstName} #{profile.lastName}"
      )
      img = _.clone info
      img.type = 'img'
      viewModels.push.call viewModels, info, img
    viewModels

