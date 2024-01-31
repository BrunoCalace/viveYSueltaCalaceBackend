import { Router } from "express"
import ProductManager from '../Controllers/product.controller.js'

const router = Router()

router.post('/', ProductManager.addToList)
router.delete('/:id', ProductManager.deleteProduct)

export default router