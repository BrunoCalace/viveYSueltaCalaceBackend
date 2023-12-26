import express from 'express'
import session from 'express-session'
import flash from 'express-flash'
import http from 'http'
import passport from './Routing/Router/passport.js'
import { Server as SocketIOServer } from 'socket.io'
import viewsRouter from './Routing/Router/viewsRouter.js'
import apiRouter from './Routing/Router/apiRouter.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import __dirname from './utils.js'
import { randomBytes } from 'crypto'

const app = express()
const server = http.createServer(app)
const io = new SocketIOServer(server)
const mongoURL = 'mongodb+srv://brunocalace:QT2q9bemAvh5n658@clustercalace.yrqgvm7.mongodb.net/'
const mongoDBName = 'ecommerce'
const secureKey = randomBytes(64).toString('hex')

app.use(session({
  secret: secureKey,
  resave: false,
  saveUninitialized: true,
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/Routing/views')
app.set('view engine', 'handlebars')

app.get('/health', (req, res) => res.send('ok'))
app.use('/', viewsRouter)
app.use('/api', apiRouter)

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
  
  mongoose.connect(mongoURL, { dbName: mongoDBName })
      .then(() => {
          console.log('DB connected')
      })
      .catch(error => {
          console.error('Error connect DB')
      });
});

export default secureKey;