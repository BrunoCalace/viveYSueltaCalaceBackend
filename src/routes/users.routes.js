import { Router } from "express"
import users from "../Controllers/user.controller.js"

const router = Router()

router.post('/:uid', users.changeRole)
router.delete('/:uid', users.deleteById)
router.delete('/', users.delete)

export default router