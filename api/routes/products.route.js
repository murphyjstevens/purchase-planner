import express from 'express'

import controller from '../controllers/products.controller.js';

const router = express.Router();

router.route('/')
  .get(controller.get)
  .post(controller.create);

export default router;
