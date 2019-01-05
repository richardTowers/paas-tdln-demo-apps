const express = require('express')
const bodyParser = require('body-parser')
const request = require('request-promise-native')
const nunjucks = require('nunjucks')
const questionsComponent = require('./assets/questions-component')
const serializeJavaScript = require('serialize-javascript')

const app = express()

nunjucks.configure('views', {
  noCache: true,
  autoescape: true,
  express: app
});

const port = process.env['PORT'] || 3000
const qrCodeUrl = process.env['QR_CODE_URL'] || 'https://localhost:5001/api/QR'
const selfUrl = process.env['SELF_URL'] || 'http://localhost:3000'
const questionListUrl = process.env['QUESTION_LIST_URL'] || 'http://localhost:8080'
const questionSubmitUrl = process.env['QUESTION_SUBMIT_URL'] || 'http://localhost:9090'

// TODO make this off by default
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

let questions = []

app.use(bodyParser.urlencoded({extended: false}))
app.use('/assets', express.static('assets'))
app.use('/node_modules/react/umd', express.static('node_modules/react/umd'))
app.use('/node_modules/react-dom/umd', express.static('node_modules/react-dom/umd'))
app.use('/node_modules/react-router-dom/umd', express.static('node_modules/react-router-dom/umd'))

app.get('/question-stream', (req, res) => {
  req.socket.setTimeout(10 * 60 * 1000)
  let counter = 0;
  setInterval(() => {
    res.write(
`id: ${counter++}
data: ${JSON.stringify(questions)}

`
    )
  }, 2000)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })
  res.write('\n')
})

app.get('/', (req, res) => {
  Promise.all([
    request({url: qrCodeUrl, qs: {url: selfUrl}}).catch(err => 'some-qr-code'),
    request({url: questionListUrl}).catch(err => console.error(err), []),
  ]).then(([qrCode, questionsRaw]) => {
    questions = JSON.parse(questionsRaw)
    const rendered = questionsComponent.render({ questions: questions })
    res.render('./home.njk', {
      page: '/',
      questionsComponent: rendered,
      qrCode: qrCode,
      selfUrl: selfUrl,
      serializedQuestionsData: serializeJavaScript(questions, {isJSON: true}),
    })
  }).catch(err => {
    console.error('error', err)
    res.send('error')
  })
})

app.get('/architecture', (req, res) => {
  res.render('./architecture.njk', {page: '/architecture'})
})

app.get('/ask', (req, res) => {
  res.render('./ask.njk', {page: '/ask'})
})

app.post('/ask', (req, res) => {
  const question = {
    name: req.body.name,
    question: req.body.question,
  }
  if (!question.name     || question.name.length     > 100 ||
      !question.question || question.question.length > 240) {
    res.render('./ask.njk', {page: '/ask', error: 'oof, validation'})
    return
  }
  request
    .post(questionSubmitUrl, {body: question, json: true})
    .then(() => {
      res.redirect('/')
    })
    .catch(err => {
      console.error('error', err)
      res.send('error')
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))

