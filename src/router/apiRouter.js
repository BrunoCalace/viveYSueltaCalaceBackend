import { Router } from "express"
import prodModel from '../models/prodModels.js'
import cartModel from '../models/cartModel.js'
import chatModel from '../models/chatModel.js'

const router = Router()

//PRODUCTS
router.post('/products', async(req, res) => {
    try{
        const prodNew = req.body

        const result = await prodModel.create(prodNew)
        console.log({result})

        res.redirect('/products')
    } catch(error) {
        res.render('error', {error: 'Error al crear el producto'})
    }
    
})

router.delete('/products/:id', async (req, res) => {
    try {
        const id = req.params.id
        await prodModel.deleteOne( { _id: id })

        return res.json({ status:'success' })
    } catch (error) {
            res.status(500).json(error)
    }
})

//CART
router.post('/cart/agregar-a-lista', async (req, res) => {
    try {
      const { id, title, price, cantidad, thumbnails } = req.body;
  
      const cart = await cartModel.findOne({ id });
  
      if (!cart) {
        const newCart = new cartModel({ id, title, price, cantidad, thumbnails });
        await newCart.save();
      } else {
        cart.cantidad += cantidad;
        await cart.save();
      }
  
      res.redirect('/cart');
    } catch (error) {
      console.error(error);
      res.render('error', { error: 'Error al agregar el producto a la lista' });
    }
});
  
router.delete('/cart/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const result = await cartModel.deleteOne({ _id: id });
  
      if (result.deletedCount === 1) {
        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
      } else {
        res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Error al eliminar el producto del carrito' });
    }
});

//CHAT
router.post('/chat', async(req, res) => {
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