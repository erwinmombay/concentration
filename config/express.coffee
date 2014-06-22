{ EXPRESS_ENV } = process.env
express = require 'express'
bodyParser = require 'body-parser'
methodOverride = require 'method-override'
logger = require 'morgan'
errorHandler = require 'errorHandler'
{ __express } = require 'jade'

module.exports = (app) ->
  app.set 'views', "#{__dirname}/../views"
  app.set 'view engine', 'jade'
  app.engine 'jade', __express
  app.use logger 'dev'
  app.use bodyParser.json()
  app.use methodOverride()
  app.use express.static "#{__dirname}/../public"
  app.set 'title', 'Concentration'

  if EXPRESS_ENV isnt 'production'
    app.use errorHandler dumpExceptions: true
