const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
let path = require('path')

require('dotenv').config()
// intitialize app
const app = express()
app.use(cors())

//setting up swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// intitialize bodyParser middleware
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb', extended: true }))
// intitialize cookieParser middleware
app.use(cookieParser());

app.use(express.static('public/story'))
app.use(express.static('public/story/charity'))
app.use(express.static('public/story/badges'))
app.use(express.static('public/story/createStory'))
app.use(express.static('public/story/pages'))
app.use(express.static('public/profile'))




const port = process.env.APP_PORT
// const port = "4800"
//require model
const db = require('./models')

const Story = db.Story
app.post('/', (req, res) => {
  Story.create({
    story_content: "story content",
    AdminId: 1
  }).then((result) => res.json(result))
})

// web routes for admin panel
let web = require('./routes/web')
app.use('/', web)
// for api
let api = require('./routes/api')
app.use('/api/v1', api)

app.use('/public', express.static(path.join(__dirname, 'public')));

// express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
// handle 404 error
app.use(function (req, res, next) {
  res.status(404);
  // respond with json
  if (req.accepts('json')) {
    res.json({ message: "Not Found, Please check app url..." });
    return;
  }
  // respond with html page
  if (req.accepts('html')) {
    res.json({ message: "Not Found, Please check app url...html" });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});
require('./app/controllers/api/CronController');
// Listen app
app.listen(port, () => {
  db.sequelize.sync().then((data) => {
    console.log('MySQL server started and tables created successfully...')
  })
  console.log(`WiseKids server started on ${port}...`)
})
