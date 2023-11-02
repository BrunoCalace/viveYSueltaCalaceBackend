import { Router } from "express"
import prodModel from '../dao/models/prodModels.js'

const router = Router()

router.get('/', async(req, res) => {
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

router.get('/create', async(req, res) => {
    res.render('create', {})
})

router.get('/:name', async(req, res) => {
    try {
        const title = req.params.name
        const product = await prodModel.findOne({ title }).lean().exec()

        res.render('one', { product })
    } catch (error) {
        res.render('error', {error: 'Error al buscar el producto'})
    }
    
})

router.post('/', async(req, res) => {
    try{
        const prodNew = req.body

        const result = await prodModel.create(prodNew)
        console.log({result})

        res.redirect('/products')
    } catch(error) {
        res.render('error', {error: 'Error al crear el producto'})
    }
    
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await prodModel.deleteOne( { _id: id })

        return res.json({ status:'success' })
   } catch (error) {
        res.status(500).json(error)
   }
})

export default router