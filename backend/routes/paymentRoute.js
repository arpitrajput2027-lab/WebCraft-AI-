import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import { createOrder, verifyPayment, demoPayment } from '../controllers/paymentController.js'



const router = express.Router()

router.post('/order', isAuthenticated, createOrder)
router.post('/verify', isAuthenticated, verifyPayment)
router.post('/demo', isAuthenticated, demoPayment)


export default router