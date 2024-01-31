import { Router } from "express"
import ChatManager from '../Controllers/chat.controller.js'

const router = Router()

router.post('/', ChatManager.addToChat)

export default router