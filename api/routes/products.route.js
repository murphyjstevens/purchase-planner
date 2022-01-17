import express from 'express'

import controller from '../controllers/products.controller.js'

const router = express.Router()

router.route('/')
  .get(controller.get)
  .post(controller.create)

router.route('/:id')
  .get(controller.find)
  .delete(controller.remove)

export default router
