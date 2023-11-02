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

router.delete('/:id', async (req, res) => {
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

export default router;