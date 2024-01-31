import { Router } from "express"
import CartManager from '../Controllers/cart.controller.js'

const router = Router()

router.post('/agregar-a-lista', CartManager.addToCart)
router.delete('/:cid', CartManager.deleteCart)
router.delete('/:cid/products/:pid', CartManager.deleteProd)
router.post('/:cid/purchase', CartManager.buyCart)

export default router