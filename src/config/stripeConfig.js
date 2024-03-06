import dotenv from 'dotenv'

dotenv.config()

export const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY

export default STRIPE_PRIVATE_KEY