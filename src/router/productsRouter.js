import { Router } from "express";
import prodModel from '../models/prodModels.js'

const router = Router()

router.get('/', async(req, res) => {
    try {
        const products = await prodModel.find().lean().exec()
        res.render('list', { products })
    } catch (error) {
        res.render('error', {error: 'Error al buscar los productos'})
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