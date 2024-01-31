import chatModel from '../DAO/mongo/models/chatModel.js'

class ChatManager {
    static async addToChat(req, res) {
        try{
            const chatNew = req.body
    
            const result = await chatModel.create(chatNew)
    
            res.redirect('/chat')
        } catch(error) {
            res.render('error', {error: 'Error al enviar el mensaje'})
        }
    }
}

export default ChatManager