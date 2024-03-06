import { Router } from 'express'
import { createSession } from '../Controllers/payment.controller.js'
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = Router()

router.get('/create-checkout-session', isAuthenticated, createSession);
router.get('/success', isAuthenticated, (req, res) => res.render('success'));
router.get('/cancel', isAuthenticated, (req, res) => res.render('cancel'));


export default router
    