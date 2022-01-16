import express from 'express'

import products from './products.route.js'

const router = express.Router();

router.use('/products', products);

export default router;