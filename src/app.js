import express from 'express'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import viewsRouter from './router/viewsRouter.js'
import apiRouter from './router/apiRouter.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import __dirname from './utils.js'

const app = express()
const server = http.createServer(app);
const io = new SocketIOServer(server);;
const mongoURL = 'mongodb+srv://brunocalace:QT2q9bemAvh5n658@clustercalace.yrqgvm7.mongodb.net/'
const mongoDBName = 'ecommerce'

io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.on('addProduct', (producto) => {
      productManager.addProduct(producto);
    });
    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
});

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static( __dirname + '/public'))

app.get('/health', (req, res) => res.send('ok'))
app.use('/', viewsRouter)
app.use('/api', apiRouter)

const PORT = process.env.PORT || 7500;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});

mongoose.connect(mongoURL, {dbName: mongoDBName })
    .then(() => {
        console.log('DB connected')
        app.listen(8080, () => console.log('Listening...'))
    })
    .catch(error => {
        console.error('Error connect DB')
    })