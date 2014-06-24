defaults =
  basePath: '../'
  frameworks: ['jasmine']
  files: [
    'specs/libs/jquery-1.11.1.js'
    'specs/libs/lodash.js'
    'specs/libs/angular.js'
    'src/server/public/js/pre-libs.js'
    'src/server/public/js/post-libs.js'
    'specs/libs/angular-mocks.js'
    'src/server/public/js/app.js'
    'specs/js/**/*.js'
  ],
  autoWatch: true,
  browsers: ['Chrome']
  reporters: ['progress']

module.exports = (config) -> config.set defaults
