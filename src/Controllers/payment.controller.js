import Stripe from 'stripe'
import STRIPE_PRIVATE_KEY from '../config/stripeConfig.js'


const stripe = new Stripe(STRIPE_PRIVATE_KEY)

export const createSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        product_data: {
                            name: 'Vive y Suelta',
                            description: 'Compra de productos Vive y Suelta',
                        },
                        currency: 'usd',
                        unit_amount: 30000,
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: 'http://localhost:8080/payments/success',
            cancel_url: 'http://localhost:8080/payments/cancel',
        });

        const url = session.url;

        res.redirect(url);
    } catch (error) {
        console.error('Error al crear la sesión de pago: ', error)
        res.status(500).send('Error al crear la sesión de pago')
    }
}