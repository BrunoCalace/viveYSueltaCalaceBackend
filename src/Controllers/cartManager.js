import cartModel from "../dao/models/cartModel.js"

class CartManager {
    static async addToCart(req, res) {
        try {
            const { id, cantidad } = req.body;
        
            const currentUser = req.user
            const cart = await cartModel.findOne({ user: currentUser._id });
        
            if (!cart) {
              const newCart = new cartModel({
                user: currentUser._id,
                products: [{ productId: id, cantidad }],
              });
              await newCart.save();
            } else {
              const existingProductIndex = cart.products.findIndex(product => product.productId.equals(id));
        
              if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].cantidad += cantidad;
              } else {
                cart.products.push({ productId: id, cantidad });
              }
        
              await cart.save();
            }
        
            res.redirect('/cart');
        } catch (error) {
            console.error(error);
            res.render('error', { error: 'Error al agregar el producto a la lista' });
        }
    }

    static async deleteCart(req, res) {
        try {
            const cartId = req.params.cid;
      
            const result = await cartModel.deleteOne({ _id: cartId });
      
            if (result.deletedCount === 1) {
              res.json({ status: 'success', message: 'Carrito eliminado correctamente' });
            } else {
              res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', error: 'Error al eliminar el carrito' });
        }
    }

    static async deleteProd(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
        
            const result = await cartModel.updateOne(
                { _id: cartId },
                { $pull: { products: { productId } } }
            );
        
            if (result) {
                res.json({ status: 'success', message: 'Producto eliminado del carrito' });
            } else {
                res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 'error', error: 'Error al eliminar el producto del carrito' });
        }
    }
}

export default CartManager