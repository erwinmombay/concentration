app.factory 'CardService', ->
  class CardViewModel
    constructor: (@type = 'info', data = {}) ->
      _.extend @, data
      @cid = "#{@type}#{@id}"
      @title = @headline
      @imgSrc = @pictureUrl
      delete @headline
      delete @pictureUrl
      @fullName = "#{@firstName} #{@lastName}"
      @flipped = false
      @matched = false

    reset: ->
      @matched = @flipped = false
      return

  # [x] -> [x]
  fisherYates = (a) ->
    i = a.length
    while --i > 0
      j = ~~(Math.random() * (i + 1))
      t = a[j]
      a[j] = a[i]
      a[i] = t
    a

  # LinkedInProfile -> Maybe String -> CardViewModel
  buildCardViewModel = (profile, type = 'info') ->
    new CardViewModel type, profile.toJSON()

  # [CardViewModel] -> [CardViewModel]
  shuffle: (cards) -> fisherYates cards[..]

  # [LinkedInProfile] -> (CardViewModel, CardViewModel)
  buildCardViewModels: (linkedInProfiles) ->
    viewModels = for profile in linkedInProfiles
      info = buildCardViewModel profile, 'info'
      img = buildCardViewModel profile, 'img'
      [info, img]

  CardViewModel: CardViewModel
