import cartModel from "../DAO/mongo/models/cartModel.js"
import userModel from "../DAO/mongo/models/userModel.js"
import prodModel from "../DAO/mongo/models/prodModel.js"
import ticketModel from "../DAO/mongo/models/ticketModel.js"
import { createSession } from "./payment.controller.js"
import { v4 as uuidv4 } from 'uuid'
import mail from "../utils/mailerCart.js"

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
      
      const cart = await cartModel.findById(cartId);
      if (!cart) {
          return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
      }

      cart.products = [];
      
      await cart.save();

      res.json({ status: 'success', message: 'Carrito vaciado correctamente' });
  } catch (error) {
      res.status(500).json({ status: 'error', error: 'Error al vaciar el carrito' });
  }
  }

  static async buyCart(req, res) {
    try {
      const cartId = req.params.cid;
      
      const cart = await cartModel.findById(cartId).populate('products.productId');
      const user = await userModel.findOne({ _id: cart.user }).populate('cart.products.productId');

      const ticketProducts = [];
      const failedProducts = [];

      for (const productInfo of cart.products){
        const { productId, cantidad } = productInfo;
        const product= await prodModel.findOne({ _id: productId })

        if (product.stock >= cantidad) {
          product.stock -= cantidad
          ticketProducts.push({ productId, cantidad })
        } else {
          failedProducts.push({ productId, cantidad });
        }
      }
      
      if (failedProducts.length === 0) {
        const ticketCode = uuidv4()
        const totalPay = await calculateTotalPay(ticketProducts)
        const ticketData = {
          code: ticketCode,
          amount: calculateTotalAmount(ticketProducts),
          total: totalPay,
          purchaserEmail: user.email,
          purchaser: user.first_name + user.last_name
        };

        const newTicket = await ticketModel.create(ticketData);
        const processedProductIds = ticketProducts.map(ticketInfo => ticketInfo.productId);
        cart.products = cart.products.filter(productInfo => !processedProductIds.includes(productInfo.productId));

        await cart.save();
        mail(newTicket);
      
        res.json({ status: 'success', message: 'Compra exitosa', newTicket });
      } else {
        cart.purchase_failed_products = failedProducts;
        await cart.save();

        const ticketCode = uuidv4()
        const totalPay = await calculateTotalPay(ticketProducts)
        const ticketData = {
          code: ticketCode,
          amount: calculateTotalAmount(ticketProducts),
          total: totalPay,
          purchaserEmail: user.email,
          purchaser: user.first_name + user.last_name
        };
        
        const newTicket = await ticketModel.create(ticketData)
        const processedProductIds = ticketProducts.map(ticketInfo => ticketInfo.productId);
        cart.products = cart.products.filter(productInfo => !processedProductIds.includes(productInfo.productId))
        
        await cart.save()
        mail(newTicket)
    
        res.json({ status: 'success', message: 'Compra exitosa', newTicket });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', error: 'Error al realizar la compra' })
    }
    
    function calculateTotalAmount(products) {
      let total = 0

      for(const productInfo of products){
        const { cantidad } = productInfo
        total += cantidad
      }
      return total
    }

    async function calculateTotalPay(products) {
      let total = 0

      try {
        for (const productInfo of products) {
          const { cantidad, productId } = productInfo
          const product = await prodModel.findById(productId)
    
          if (product) {
            total += cantidad * product.price
          } else {
            console.error(`No se encontró el producto con ID: ${productId}`)
          }
        }
        return total
      } catch (error) {
        console.error('Error al calcular el total de pago:', error)
        throw error
      }
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
      res.status(500).json({ status: 'error', error: 'Error al eliminar el producto del carrito' });
    }
  }
}

export default CartManager