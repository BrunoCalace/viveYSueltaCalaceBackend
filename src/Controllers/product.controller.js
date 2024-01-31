import prodModel from "../DAO/mongo/models/prodModel.js"

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
            await prodModel.deleteOne( { _id: id })
    
            return res.json({ status:'success' })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

export default ProductManager