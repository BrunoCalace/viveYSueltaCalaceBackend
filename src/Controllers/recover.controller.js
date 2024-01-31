import mail from '../utils/mailerPass.js'
import userModel from '../DAO/mongo/models/userModel.js'

class RecoverManager {
    static async recover(req, res) {
        try {
            const userEmail = req.body.email;

            const usuario = await userModel.findOne({ email: userEmail })
            console.log(usuario)

            const user = {
                _id: usuario._id,
                email: userEmail,
            }

            await mail(user)

            res.status(200).json({ status: 'success', message: 'Correo de recuperación enviado con éxito' });
        } catch (error) {
            console.error('Error al enviar el correo de recuperación:', error);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor al enviar el correo de recuperación' });
        }
    }

    static async change(req, res) {
        try {
            const userEmail = req.body.email
            console.log(userEmail)
            const newPassword = req.body.password
            const confirmPassword = req.body.confirmPassword

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ status: 'error', message: 'Las contraseñas no coinciden' });
            }

            const user = await userModel.findOne({ email: userEmail })

            if (!user) {
                return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
            }

            await user.changePassword(newPassword);

            res.status(200).json({ status: 'success', message: 'Contraseña cambiada con éxito' });
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            res.status(500).json({ status: 'error', message: 'Error interno del servidor al cambiar la contraseña' });
        }
    }
}

export default RecoverManager