import express from 'express'
import productsRouter from './router/productsRouter.js'
import chatRouter from './router/chatRouter.js'
import cartRouter from './router/cartRouter.js'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose'
import __dirname from './utils.js'

const app = express()
const mongoURL = 'mongodb+srv://brunocalace:QT2q9bemAvh5n658@clustercalace.yrqgvm7.mongodb.net/'
const mongoDBName = 'ecommerce'

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static( __dirname + '/public'))

app.get('/health', (req, res) => res.send('ok'))
app.use('/products', productsRouter)
app.use('/chat', chatRouter)
app.use('/cart', cartRouter)


mongoose.connect(mongoURL, {dbName: mongoDBName })
    .then(() => {
        console.log('DB connected')
        app.listen(8080, () => console.log('Listening...'))
    })
    .catch(error => {
        console.error('Error connect DB')
    })