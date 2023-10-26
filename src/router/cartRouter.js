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
    const productData = req.body;

    const result = await cartModel.create(productData);

    console.log({ result });

    res.redirect('/cart');
  } catch (error) {
    res.render('error', { error: 'Error al agregar el producto a la lista' });
  }
});

export default router;