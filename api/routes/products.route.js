import express from 'express'

import controller from '../controllers/products.controller.js'

const router = express.Router()

router.route('/')
  .get(controller.get)
  .post(controller.create)
  .put(controller.update)

router.route('/:id')
  .get(controller.find)
  .delete(controller.remove)

router.route('/:id/purchases')
  .patch(controller.markPurchased)

router.route('/reorder')
  .patch(controller.reorder)

export default router
