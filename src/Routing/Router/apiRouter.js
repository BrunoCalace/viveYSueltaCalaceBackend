import { Router } from "express"
import passport from './passport.js'
import sessionsController from '../../Controllers/sessionsManager.js'
import productManager from '../../Controllers/productManager.js'
import cartManager from '../../Controllers/cartManager.js'
import chatManager from '../../Controllers/chatManager.js'

const router = Router()

//PRODUCTS
router.post('/products', productManager.addToList)
router.delete('/products/:id', productManager.deleteProduct)

//CART
router.post('/cart/agregar-a-lista', cartManager.addToCart)
router.delete('/cart/:cid', cartManager.deleteCart)
router.delete('/cart/:cid/products/:pid', cartManager.deleteProd)

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
