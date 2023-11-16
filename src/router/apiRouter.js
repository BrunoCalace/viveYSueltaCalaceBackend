import { Router } from "express"
import prodModel from '../models/prodModels.js'
import cartModel from '../models/cartModel.js'
import chatModel from '../models/chatModel.js'
import sessionsController from '../classes/sessionsManager.js'

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
    const { id, cantidad } = req.body;

    const cart = await cartModel.findOne();

    if (!cart) {
      const newCart = new cartModel({
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
});
  
router.delete('/cart/:cid', async (req, res) => {
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
});

router.delete('/cart/:cid/products/:pid', async (req, res) => {
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
});

//CHAT
router.post('/chat', async(req, res) => {
    try{
        const chatNew = req.body

        const result = await chatModel.create(chatNew)

        res.redirect('/chat')
    } catch(error) {
        res.render('error', {error: 'Error al enviar el mensaje'})
    }
})

//SESSIONS
router.post('/signup', sessionsController.signup)
router.post('/login', sessionsController.login)
router.get('/logout', sessionsController.logout)

export default router
