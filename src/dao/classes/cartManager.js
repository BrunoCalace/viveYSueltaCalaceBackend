import cartModel from "../models/cartModel.js"
import userModel from "../models/userModel.js"

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

  static async buyCart(req, res) {
    try {
      const cartId = req.params.cid;
      
      const cart = await cartModel.findById(cartId).populate('products.productId');
      const user = await userModel.findOne({ cart: cartId }).populate('users.cart')
      
      const ticketProducts = [];
      const failedProducts = [];
      
      for (const productInfo of cart.products) {
        const { productId, cantidad } = productInfo;
        const product = productId;
      
        if (product.stock >= cantidad) {
          product.stock -= cantidad;
          ticketProducts.push({ productId, cantidad });
        } else {
          failedProducts.push({ productId, cantidad });
        }
      }
      
      await Promise.all(cart.products.map(productInfo => productInfo.productId.save()));
      
      if (failedProducts.length > 0) {
        cart.purchase_failed_products = failedProducts;
        await cart.save();
      } else {
        const ticketData = {
          amount: calculateTotalAmount(ticketProducts),
          purchaserEmail: user.email,
          purchaser: user.first_name + user.last_name
        };
      
        const newTicket = await ticketModel.create(ticketData);
      
        await cartModel.findByIdAndDelete(cartId);
      
        res.json({ status: 'success', message: 'Compra exitosa', ticketId: newTicket._id });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error al realizar la compra' });
    }
    
    function calculateTotalAmount(products) {
      return products.reduce((total, product) => total + product.price * product.cantidad, 0);
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