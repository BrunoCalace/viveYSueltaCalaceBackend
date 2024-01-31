import { Router } from "express"
import { isAdmin, isNotAuthenticated, isAuthenticated } from '../middlewares/authMiddleware.js'
import ViewsManager from '../Controllers/views.controller.js'


const router = Router()

router.get('/', isNotAuthenticated, ViewsManager.login)
router.get('/signup', isNotAuthenticated, ViewsManager.signup)
router.get('/products', isAuthenticated, ViewsManager.products)
router.get('/products/create', isAdmin, ViewsManager.create)
router.get('/products/:name', ViewsManager.productOne)
router.get('/cart', isAuthenticated, ViewsManager.cart)
router.get('/chat', isAuthenticated, ViewsManager.chat)
router.get('/profile', isAuthenticated, ViewsManager.profile)
router.get('/recoverPass', ViewsManager.recover)
router.get('/changePass/:userId', ViewsManager.changePass)
router.get('/loggerTester', ViewsManager.loggerTester)

export default router
