import { Router } from "express"
import prodModel from '../models/prodModels.js'
import cartModel from '../models/cartModel.js'
import chatModel from '../models/chatModel.js'

const router = Router()

//PRODUCTS
router.get('/products', async(req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        const query = req.query.query || ''
    
        const queryOptions = {}
        if (query) {
          queryOptions.category = query
        }

        let productsQuery = prodModel.find(queryOptions)
    
        if (req.query.sort && (req.query.sort === 'asc' || req.query.sort === 'desc')) {
            const sort = req.query.sort === 'desc' ? -1 : 1;
            productsQuery = productsQuery.sort({ price: sort });
          }

        const products = await productsQuery
          .skip((page - 1) * limit)
          .limit(limit)
          .lean()
          .exec();
        
        const totalProducts = await prodModel.countDocuments(queryOptions);
        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
      
        const prevLink = hasPrevPage ? `/products?page=${page - 1}` : null;
        const nextLink = hasNextPage ? `/products?page=${page + 1}` : null;
        
        res.render('list', {
            status: 'success',
            products,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
      } catch (error) {
        res.render('error', { error: 'Error al buscar los productos' });
      }
})

router.get('/products/create', async(req, res) => {
    res.render('create', {})
})

router.get('/products/:name', async(req, res) => {
    try {
        const title = req.params.name
        const product = await prodModel.findOne({ title }).lean().exec()

        res.render('one', { product })
    } catch (error) {
        res.render('error', {error: 'Error al buscar el producto'})
    }
    
})

//CART
router.get('/cart', async (req, res) => {
    try {
        const cart = await cartModel.find().lean().exec()
        res.render('cartList', { cart })
    } catch (error) {
        res.render('error', {error: 'Error al buscar los productos'})
    }
})

//CHAT
router.get('/chat', async(req, res) => {
    try {
        const messages = await chatModel.find().lean().exec()
        res.render('chat', { messages })
    } catch (error) {
        res.render('error', {error: 'Error al buscar los mensajes'})
    }
})

export default router
