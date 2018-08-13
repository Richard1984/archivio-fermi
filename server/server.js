require('./db/config/config.js')

const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const socketIO = require('socket.io')
const helmet = require('helmet')
const history = require('connect-history-api-fallback')
const compression = require('compression')
const morgan = require('morgan')
const cors = require('cors')

const {
  mongoose
} = require('./db/mongoose')

// Models
const {
  User
} = require('./models/user')

// Middleware
const {
  authenticate
} = require('./middleware/authenticate')

const {
  asyncMiddleware
} = require('./middleware/async')

// Routes
const admin = require('./routes/admin')
const documents = require('./routes/documents')
const collections = require('./routes/collections')
const api = require('./routes/api')
const signup = require('./routes/signup')
const login = require('./routes/login')
const users = require('./routes/users')
const publicRoute = require('./routes/public')

const app = express()
const server = http.createServer(app)

const io = socketIO(server)

const port = process.env.PORT || 3000

app.use(history())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(helmet())
app.use(morgan('dev'))
app.use(compression())
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
  method: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

app.options('*', cors())

app.use((req, res, next) => {
  req.messages = []
  next()
})

// Routes
app.use('/admin', admin)
app.use('/documents', documents)
app.use('/collections', collections)
app.use('/api', api)
app.use('/signup', signup)
app.use('/login', login)
app.use('/users', users)
app.use('/public', publicRoute)

// Public directory
app.use(express.static(path.join(__dirname, '/public')))

// Socket events
io.on('connection', (socket) => {
  socket.on('newDocument', () => {
    io.emit('newDocument')
  })

  socket.on('documentDeleted', () => {
    io.emit('documentDeleted')
  })

  socket.on('documentUpdated', () => {
    io.emit('documentUpdated')
  })

  socket.on('newUser', () => {
    io.emit('newUser')
  })

  socket.on('collectionDeleted', () => {
    io.emit('collectionDeleted')
  })

  socket.on('collectionUpdated', () => {
    io.emit('collectionUpdated')
  })

  socket.on('userUpdated', (user) => {
    io.emit('userUpdated', user)
    // socket.broadcast.emit('userUpdated', user) <===== DA VEDERE
  })

  socket.on('userDeleted', (user) => {
    // io.emit('userDeleted', user)
    socket.broadcast.emit('userDeleted')
  })
})

/*
 * Utente loggato
 */
app.get('/logout', authenticate, asyncMiddleware(async (req, res) => {
  res.status(200).clearCookie('token').redirect('/')
}))

app.use((err, req, res, next) => {
  res.status(500).send({
    messages: [err.message]
  })
  next(err)
})

server.listen(port, () => {
  console.log(`Server started on port ${port}.`)
})
