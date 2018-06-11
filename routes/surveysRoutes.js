const _ = require('lodash')
const { Path } = require('path-parser')
const { URL } = require('url')
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const requireCredits = require('../middlewares/requireCredits')
const Mailer = require('../services/Mailer')
const surveyTemplate = require('../services/emailTemplates/surveyTemplate')

const Survey = mongoose.model('surveys')
const sqSurvey = require('../sequelize/models/Survey')
const sqRecipient = require('../sequelize/models/Recipient')
const sqUser = require('../sequelize/models/User')

module.exports = app => {

    app.get('/api/surveys', requireLogin, async (req, res) => {
      // const surveys = await Survey.find({ _user: req.user.id })
      //   .select({ recipients: false })
      const surveys = await sqSurvey.findAll({
        where: {
          userId: req.user.googleId,
        },
        raw: true,
      })
      res.send(surveys || [])
    })

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
      res.send('Thanks for voting!')
    })

    app.post('/api/surveys/webhooks', (req, res) => {

      console.log(req)
      const p = new Path('/api/surveys/:surveyId/:choice')

      _.chain(req.body)
        .map(({email, url}) => {

          console.log(email, url)
          const match = p.test(new URL(url).pathname)

          console.log(email, url, match)
          if (match) {
            return { email, surveyId: match.surveyId, choice: match.choice}
          }
        })
        .compact()
        .uniqBy('email', 'surveyId')
        .each(({ surveyId, email, choice }) => {
          console.log(surveyId, email, choice)
          sqSurvey.findById(surveyId)
            .then(survey => {
              survey.increment(choice, {by: 1})
            })

          sqSurvey.update({
            lastResponded: new Date(),
          })
        })
        .value()

      res.send({})
    })

    app.post('/api/surveys', requireLogin, async (req, res) => {
      const { title, subject, body, recipients, group} = req.body
      // const survey = new Survey({
      //   title,
      //   subject,
      //   body,
      //   recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      //   _user: req.user.id,
      //   dateSent: Date.now()
      // })
      let survey = null
      try {
        const recipientsArray = recipients.split(',')
        let dbRecipients = []
        for (let i = 0; i < recipientsArray.length; i++) {
          let recipient = await sqRecipient.findOrCreate({
            where: {email: recipientsArray[i]},
            defaults: {email: recipientsArray[i]},
          }).spread((recipient, created) => recipient)
          dbRecipients.push(recipient)
        }


        survey = await sqSurvey.create({
          title,
          subject,
          body,
          userId: req.user.googleId,
          dateSent: Date.now(),
        })

        await survey.addRecipients(dbRecipients)

        // Send email
        const mailer = new Mailer(survey, surveyTemplate(survey.get({plain: true})), await survey.getRecipients({raw: true}))

        await mailer.send()

        const user = await sqUser.findById(req.user.googleId)
        user.decrement('credits', {by: 1})

        res.status(201).send(user.get({plain: true}))
      } catch (err) {
        res.status(422).send(err)
      }
    })
}
