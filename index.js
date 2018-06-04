const express = require('express')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bodyParser = require('body-parser')
// Initialize Sequelize DB and test connection
require('./sequelize/db')

// Initialize Sequelize models
require('./sequelize/models/User')
require('./sequelize/models/Survey')

// Initialize  mongoDB models
require('./models/User')
require('./models/Survey')
require('./services/passport')

// Connect to mongoDB
mongoose.connect(keys.mongoURI)

// Initialize app
const app = express();

// Add midlewares
app.use(bodyParser.json())
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

// Setup routes
require('./routes/authRoutes')(app)
require('./routes/billingRoutes')(app)
require('./routes/surveysRoutes')(app)

// Setup production client serving
if (process.env.NODE_ENV === 'production') {
  // Express serve production assets
  app.use(express.static('client/build'))

  // Serve index.html for unknown routes
  const path = require('path')
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// Start listening
const PORT = process.env.PORT || 5000
app.listen(PORT)
