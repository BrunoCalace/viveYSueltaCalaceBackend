import { Router } from "express"
import RecoverManager from '../Controllers/recover.controller.js'

const router = Router()

router.post('/', RecoverManager.change)

export default router