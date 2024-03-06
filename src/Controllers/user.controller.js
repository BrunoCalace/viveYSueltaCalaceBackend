import mail from '../utils/mailerUsers.js'
import userModel from '../DAO/mongo/models/userModel.js'

class UserManager {
    static async changeRole(req, res) {
        try {
            const id = req.params.uid
            const newRole = req.body.newRole

            const user = await userModel.findById(id)
    
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado" })
            }

            user.role = newRole
            await user.save()

            res.status(200).json({ message: "Rol del usuario actualizado correctamente" })
        } catch (error) {
            console.error("Error al cambiar el rol del usuario:", error)
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
    static async deleteById(req, res) {
        try {
            const userId = req.params.uid;
            
            const result = await userModel.deleteOne({ _id: userId });
            
            if (result.deletedCount === 1) {
              res.json({ status: 'success', message: 'Usuario eliminado correctamente' })
            } else {
              res.status(404).json({ status: 'error', message: 'Usuario no encontrado' })
            }
        } catch (error) {
            res.status(500).json({ status: 'error', error: 'Error al eliminar el usuario' })
        }
    }
    static async delete(req, res) {
        try {
            const currentDate = new Date()
    
            const limitDate = new Date(currentDate)
            limitDate.setDate(limitDate.getDate() - 2)
    
            const inactiveUsers = await userModel.find({ lastActivityDate: { $lt: limitDate } })
    
            const deletionResult = await userModel.deleteMany({ lastActivityDate: { $lt: limitDate } })
    
            if (deletionResult.deletedCount > 0) {
                await Promise.all(inactiveUsers.map(async (user) => {
                    try {
                        await mail(user)
                    } catch (error) {
                        console.error(`Error al enviar correo electrónico a ${user.email}:`, error);
                    }
                }));

                return res.json({ status: 'success', message: `${deletionResult.deletedCount} usuarios inactivos eliminados correctamente`, inactiveUsers })
            } else {
                return res.json({ status: 'success', message: 'No se encontraron usuarios inactivos para eliminar' })
            }
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error)
            res.status(500).json({ status: 'error', message: 'Error interno del servidor' })
        }
    }
}
   


export default UserManager