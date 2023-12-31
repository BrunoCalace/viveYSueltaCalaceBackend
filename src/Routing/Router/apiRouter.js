import { Router } from "express"
import nodemailer from 'nodemailer'
import passport from './passport.js'
import sessionsController from '../../dao/classes/sessionsManager.js'
import productManager from '../../dao/classes/productManager.js'
import cartManager from '../../dao/classes/cartManager.js'
import chatManager from '../../dao/classes/chatManager.js'

const transport = nodemailer.createTransport ({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'bruno.calace@gmail.com',
    pass: 'unouzhpdqrbggipb'
  }
})
const router = Router()

//PRODUCTS
router.post('/products', productManager.addToList)
router.delete('/products/:id', productManager.deleteProduct)

//CART
router.post('/cart/agregar-a-lista', cartManager.addToCart)
router.delete('/cart/:cid', cartManager.deleteCart)
router.delete('/cart/:cid/products/:pid', cartManager.deleteProd)
router.post('/cart/:cid/purchase', cartManager.buyCart, async (req, res) => {
  try {
    const result = await transport.sendMail({
      from: 'bruno.calace@gmail.com',
      to: 'bruno.calace@gmail.com',
      subject: `Compra de ${user.first_name} ${user.last_name}`,
      html: `
        <div>
          <h1>Compra</h1>
          <p>Código: ${newTicket.code}</p>
          <p>Cliente: ${newTicket.purchaser}</p>
          <p>Cantidad de productos: ${newTicket.amount}</p>
          <p>Fecha: ${newTicket.purchase_datetime}</p>
        </div>
      `,
      attachments: []
    });
    res.status(200).json({ status: 'success', message: 'Compra exitosa', ticketId: newTicket._id });
  } catch (error) {
    console.error('Error al procesar la compra y enviar el correo:', error);
    res.status(500).json({ status: 'error', error: 'Error al procesar la compra y enviar el correo' });
  }
})

//CHAT
router.post('/chat', chatManager.addToChat)

//SESSIONS
router.post('/signup', sessionsController.signup)
router.post('/login', passport.authenticate('local'),  sessionsController.login)
router.get('/logout', sessionsController.logout)

router.get(
  '/login-github',
  passport.authenticate('github', {scope: ['user:email']}),
  async(req,res) => {}
)

//CALLBACK
router.get('/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/' }),
  async(req, res) => {
    console.log('Callback: ', req.user);
    req.session.user = req.user;
    res.redirect('/api/');
  }
)

router.get('/', (req,res)=>{
  const user = req.session.user;
  res.render('profile', { user });
})

export default router
