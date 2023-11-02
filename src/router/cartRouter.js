import { Router } from 'express'
import cartModel from '../dao/models/cartModel.js'

const router = Router();

router.get('/', async (req, res) => {
    try {
        const cart = await cartModel.find().lean().exec()
        res.render('cartList', { cart })
    } catch (error) {
        res.render('error', {error: 'Error al buscar los productos'})
    }
})

router.post('/agregar-a-lista', async (req, res) => {
  try {
    const { id, title, price, cantidad } = req.body;

    const cart = await cartModel.findOne({ id });

    if (!cart) {
      const newCart = new cartModel({ id, title, price, cantidad });
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

export default router;