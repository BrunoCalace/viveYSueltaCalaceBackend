import dotenv from 'dotenv'
import express from 'express'
import session from 'express-session'
import flash from 'express-flash'
import http from 'http'
import passport from './routes/passport.js'
import viewsRouter from './routes/views.routes.js'
import prodRouter from './routes/prod.routes.js'
import cartRouter from './routes/cart.routes.js'
import chatRouter from './routes/chat.routes.js'
import sessionsRouter from './routes/sessions.routes.js'
import recoverRouter from './routes/recover.routes.js'
import changeRouter from './routes/change.routes.js'
import usersRouter from './routes/users.routes.js'
import paymentsRouter from './routes/payments.routes.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swaggerConfig.js'
import __dirname from './dirname.js'
import { randomBytes } from 'crypto'
import { addLogger } from './utils/logger.js'
import { logger } from './utils/logger.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const mongoURL = process.env.MONGO_URL
const mongoDBName = process.env.MONGO_DB_NAME || 'ecommerce';
const sessionSecret = process.env.SESSION_SECRET || randomBytes(64).toString('hex');
const PORT = process.env.PORT || 8080;

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
}))

app.use(addLogger)

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.get('/health', (req, res) => res.send('ok'))
app.use('/', viewsRouter)
app.use('/api/products', prodRouter)
app.use('/api/cart', cartRouter)
app.use('/api/chat', chatRouter)
app.use('/api/recoverPass', recoverRouter)
app.use('/api/changePass', changeRouter)
app.use('/api/users', usersRouter)
app.use('/payments', paymentsRouter)
app.use('/api', sessionsRouter)
app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }))

server.listen(PORT, () => {
  logger.info(`Servidor en ejecución en el puerto ${PORT}`);
  
  mongoose.connect(mongoURL, { dbName: mongoDBName })
      .then(() => {
        logger.info('DB connected');
      })
      .catch(error => {
        logger.error(`Error connect DB: ${error.message}`);
      });
});

export default sessionSecret;