import prodModel from "../DAO/mongo/models/prodModel.js"
import userModel from "../DAO/mongo/models/userModel.js"
import mail from "../utils/mailerDelProd.js"

class ProductManager {
    static async addToList(req, res) {
        try {
            const prodNew = req.body

            const result = await prodModel.create(prodNew)
            console.log({result})

            res.redirect('/products')
        } catch (error) {
            res.render('error', {error: 'Error al crear el producto'})
        }
    }

    static async deleteProduct(req, res) {
        try {
            const id = req.params.id
            const result = await prodModel.findById( { _id: id })
            console.log(result)

            const user = await userModel.findOne( { email: result.owner } )
            console.log('Usuario del producto a eliminar:', user)

            if (user && user.role === 'premium') {
                try {
                    await mail(result, user)
                    console.log('Correo electrónico enviado con éxito')
                } catch (error) {
                    console.error('Error al enviar el correo electrónico:', error)
                }
            }

            await prodModel.deleteOne( { _id: id })
    
            return res.json({ status:'success' })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export default ProductManager