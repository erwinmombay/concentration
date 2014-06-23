{ PORT } = process.env
express = require 'express'
app = express()
require('./config/express')(app)

app.get '/', (req, res) ->
  res.render 'index', title: app.get 'title'

app.listen PORT || 8000
