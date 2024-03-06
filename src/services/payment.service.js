import Stripe from 'stripe'

const stripeKey = process.env.stripeKey

export default class PaymentService {
    constructor() {
        this.stripe = new Stripe(stripeKey)
    }

    createPaymentIntent = async(data) => {
        const PaymentIntent = this.stripe.paymentIntents.create(data)
        console.log({ PaymentIntent })

        return PaymentIntent
    }
}