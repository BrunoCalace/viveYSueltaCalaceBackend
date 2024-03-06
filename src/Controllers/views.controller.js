import prodModel from '../DAO/mongo/models/prodModel.js'
import cartModel from '../DAO/mongo/models/cartModel.js'
import chatModel from '../DAO/mongo/models/chatModel.js'
import userModel from '../DAO/mongo/models/userModel.js'
import { logger } from '../utils/logger.js'

class ViewsManager {
    static async login(req,res) {
        try {
            if (req.session.userId) {
                res.redirect('/profile');
              } else {
                res.render('login');
              }
        } catch (error) {
            res.render('error', { error: 'Error al cargar la página' })
        }
    }

    static async signup(req, res) {
        try {
            res.render('signup')
        } catch (error) {
            res.render('error', { error: 'Error al cargar la página' })
        }
    }

    static async products(req, res) {
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
            
            const userId = req.session.userId;
            const user = await userModel.findById(userId).lean().exec();
    
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
                user: {
                    fullName: `${user.first_name} ${user.last_name}`,
                },
            });
        } catch (error) {
            res.render('error', { error: 'Error al buscar los productos' });
        }
    }

    static async create(req, res) {
        try {
            const userId = req.session.userId
            const user = await userModel.findById(userId)
            if (!user) {
                throw new Error('Usuario no encontrado')
            }
            res.render('create', { userEmail: user.email })
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el correo electrónico del usuario' })
        }
    }

    static async productOne(req, res) {
        try {
            const title = req.params.name
            const product = await prodModel.findOne({ title }).lean().exec()
    
            res.render('one', { product })
        } catch (error) {
            res.render('error', {error: 'Error al buscar el producto'})
        }
    }

    static async cart(req, res) {
        try {
            const user = req.user;
            if (!user || !user.cart) {
                return res.render('cartList', { cart: [] });
            }
            
            const cart = await cartModel.findById(user.cart).lean().exec();
            
            if (!cart) {
                return res.render('cartList', { cart: [] });
            }
    
            const products = await Promise.all(cart.products.map(async (productInCart) => {
                const productDetails = await prodModel.findById(productInCart.productId).lean().exec()
                return {
                    ...productInCart,
                    ...productDetails
                };
            }));
    
            res.render('cartList', { cartId: user.cart, cart: products, total: cart.total });
        } catch (error) {
          res.render('error', { error: 'Error al buscar los productos en el carrito' });
        }
    }

    static async chat(req, res) {
        try {
            const messages = await chatModel.find().lean().exec()
            res.render('chat', { messages })
        } catch (error) {
            res.render('error', {error: 'Error al buscar los mensajes'})
        }
    }

    static async profile(req, res) {
        try {
            const userId = req.session.userId;
        
            const user = await userModel.findById(userId).lean().exec()
        
            if (!user) {
              return res.render('error', { error: 'Usuario no encontrado' });
            }
        
            res.render('profile', { user });
        }catch (error) {
            res.render('error', { error: 'Error al obtener datos del usuario' });
        }
    }

    static async recover(req, res) {
        res.render('recoverPass')
    }

    static async changePass(req, res) {
        res.render('changePass')
    }

    static async users(req, res) {
        try {
            const users = await userModel.find().lean().exec()

            res.render('userList', { users })
          } catch (error) {
            console.error('Error al obtener usuarios:', error)
            res.status(500).send('Error interno del servidor')
          }
    }

    static async loggerTester(req, res) {
        try {
            // Simulación de una operación exitosa
            logger.info('Operación exitosa: ');
    
            // Simulación de un error
            throw new Error('Este es un mensaje de error para probar el logger.');
    
        } catch (error) {
            // Registra el error en el logger
            logger.error(`Error en /loggerTester: ${error.message}`);
    
            // Envía una respuesta al cliente indicando que ocurrió un error
            res.status(500).json({ status: 'error', message: 'Ocurrió un error en /loggerTester' });
        }
    }
}

export default ViewsManager