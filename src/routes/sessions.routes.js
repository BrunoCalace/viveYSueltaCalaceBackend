import { Router } from "express"
import SessionsController from '../Controllers/sessions.controller.js'
import passport from './passport.js'

const router = Router()

router.post('/signup', SessionsController.signup)
router.post('/login', passport.authenticate('local'),  SessionsController.login)
router.get('/logout', SessionsController.logout)

router.get(
    '/login-github',
    passport.authenticate('github', {scope: ['user:email']}),
    async(req,res) => {}
  )
  
//CALLBACK
router.get('/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), async(req, res) => {
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