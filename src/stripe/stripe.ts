import * as dotenv from 'dotenv';
const Stripe = require('stripe');
dotenv.config()

export const stripe = Stripe(process.env.STRIPE_API_KEY);
