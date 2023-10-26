import { Router } from 'express'
import chatModel from '../DAO/models/chatModel.js'

const router = Router()

router.get('/', async(req, res) => {
    try {
        const messages = await chatModel.find().lean().exec()
        res.render('chat', { messages })
    } catch (error) {
        res.render('error', {error: 'Error al buscar los mensajes'})
    }
})

router.post('/', async(req, res) => {
    try{
        const chatNew = req.body

        const result = await chatModel.create(chatNew)
        console.log({result})

        res.redirect('/chat')
    } catch(error) {
        res.render('error', {error: 'Error al enviar el mensaje'})
    }
    
})

export default router