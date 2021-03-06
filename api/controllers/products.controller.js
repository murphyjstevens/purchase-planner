import db from '../db/index.js'

const RETURN_OBJECT = 'id, name, cost, url, sort_order as sortOrder, purchased_date as purchasedDate'

// Get
async function get (request, response) {
  const showPurchased = request.query.showPurchased ? request.query.showPurchased.toLowerCase().trim() === 'true' : false
  if (showPurchased) {
    await getPurchased(request, response)
  } else {
    await getActive(request, response)
  }
}

// Get Active
async function getActive (request, response) {
  try {
    const { rows } = await db.query(`SELECT ${RETURN_OBJECT} FROM product WHERE purchased_date is null`)
    const result = rows.map(mapProduct)
    response.send(result)
  } catch (error) {
    response.status(500).send(error)
    console.error(error)
  }
}

// Get Purchased
async function getPurchased (request, response) {
  try {
    const { rows } = await db.query(`SELECT ${RETURN_OBJECT} FROM product WHERE purchased_date is not null`)
    const result = rows.map(mapProduct)
    response.send(result)
  } catch (error) {
    response.status(500).send(error)
    console.error(error)
  }
}

// Find
async function find (request, response) {
  const id = Number(request.params.id)
  if (!id || isNaN(id) || id < 1) {
    response.status(400).send('Id must be a positive integer')
    console.error('Id must be a positive integer')
    return
  }

  try {
    const { rows } = await db.query(`SELECT ${RETURN_OBJECT} FROM product WHERE id = $1`, [id])
    if (!rows.length) {
      response.status(404).end()
      console.error('Not found')
      return
    }

    response.send(mapProduct(rows[0]))
  } catch (error) {
    response.status(500).send(error)
    console.error(error)
  }
}

// Create
async function create (request, response) {
  const product = {
    name: request.body.name,
    url: request.body.url,
    cost: Number(request.body.cost),
    sortOrder: Number(request.body.sortOrder)
  }

  if (!product.name) {
    response.status(400).send('Name is required')
    console.error('Name is required')
    return
  }

  const query = {
    text: `INSERT INTO product (name, url, cost, sort_order, last_modified)
            VALUES ($1, $2, $3, $4, now() at time zone 'utc')
            RETURNING ${RETURN_OBJECT}`,
    values: [product.name, product.url, product.cost, product.sortOrder]
  }
  try {
    const { rows } = await db.query(query)
    response.send(mapProduct(rows[0]))
  } catch (error) {
    response.status(500).send(error)
    console.error(error)
  }
}

// Update
async function update (request, response) {
  const product = {
    id: Number(request.body.id),
    name: request.body.name,
    url: request.body.url,
    cost: Number(request.body.cost)
  }

  const errors = []

  if (!product.id || isNaN(product.id) || product.id < 1) {
    errors.push('Id must be a positive integer')
  }
  if (!product.name) {
    errors.push('Name is required')
  }
  if ((!product.cost && product.cost !== 0) || isNaN(product.cost)) {
    errors.push('Cost is required')
  }
  if (errors.length) {
    response.status(400).send(errors.join('\n'))
    return
  }

  const query = {
    text: `UPDATE product
            SET name = $2, url = $3, cost = $4, last_modified = now() at time zone 'utc'
            WHERE id = $1
            RETURNING ${RETURN_OBJECT}`,
    values: [product.id, product.name, product.url, product.cost]
  }
  try {
    const { rows } = await db.query(query)
    response.send(mapProduct(rows[0]))
  } catch (error) {
    response.status(500).send(error)
    console.error(error)
  }
}

// Mark Purchased
async function markPurchased (request, response) {
  const id = Number(request.params.id)
  const date = request.query.date ? new Date(request.query.date) : null
  if (!id || id.isNaN) {
    response.status(400).send('The Id must be a positive integer')
    return
  }
  if (!date) {
    response.status(400).send('There date field is required')
    return
  }

  const query = {
    text: `UPDATE product
            SET purchased_date = $2, sort_order = null, last_modified = now() at time zone 'utc'
            WHERE id = $1
            RETURNING ${RETURN_OBJECT}`,
    values: [id, date]
  }

  try {
    const sortOrder = await getSortOrder(id)
    if (sortOrder === undefined) {
      response.status(404).send('A product was not found with the provided id')
      return
    }

    await db.query(query)
    if (sortOrder) {
      await updateHigherSortOrders(sortOrder)
    }
    response.end()
  } catch (error) {
    response.status(500).send(error)
    console.error(error)
  }
}

// Reorder
async function reorder (request, response) {
  if (!request.body.item1 || !request.body.item2) {
    response.status(400).send('Both Item1 and Item2 are required')
    return
  }
  const item1 = { id: Number(request.body.item1.id), sortOrder: request.body.item1.sortOrder }
  const item2 = { id: Number(request.body.item2.id), sortOrder: request.body.item2.sortOrder }

  const errors = []

  if (!item1.id || isNaN(item1.id) || item1.id < 1) {
    errors.push('Item1Id must be a positive integer')
  }
  if (!item2.id || isNaN(item2.id) || item2.id < 1) {
    errors.push('Item2Id must be a positive integer')
  }

  if (!item1.sortOrder || isNaN(item1.sortOrder) || item1.sortOrder < 1) {
    errors.push('Item1SortOrder must be a positive integer')
  }
  if (!item2.sortOrder || isNaN(item2.sortOrder) || item2.sortOrder < 1) {
    errors.push('Item2SortOrder must be a positive integer')
  }
  if (item1.sortOrder + 1 !== item2.sortOrder && item1.sortOrder - 1 !== item2.sortOrder) {
    errors.push('The two objects are not in a valid order')
  }
  if (errors.length) {
    response.status(400).send(errors.join('\n'))
    return
  }

  try {
    const newItem1 = await reorderItem(item1)
    const newItem2 = await reorderItem(item2)
    response.send({ item1: newItem1, item2: newItem2 })
  } catch (error) {
    response.status(500).send(error)
    console.error(error)
  }
}

// Reorder Item
async function reorderItem (item) {
  const query = {
    text: `UPDATE product
            SET sort_order = $2, last_modified = now() at time zone 'utc'
            WHERE id = $1
            RETURNING ${RETURN_OBJECT}`,
    values: [item.id, item.sortOrder]
  }

  const { rows } = await db.query(query)
  return mapProduct(rows[0])
}

// Remove
async function remove (request, response) {
  const id = Number(request.params.id)
  if (!id || isNaN(id) || id < 1) {
    response.status(400).send('Id must be a positive integer')
    return
  }
  const deleteQuery = 'DELETE FROM product WHERE id = $1'
  try {
    const sortOrder = await getSortOrder(id)
    if (sortOrder === undefined) {
      response.status(404).send('A product was not found with the provided id')
      return
    }
    await db.query(deleteQuery, [id])
    if (sortOrder) {
      await updateHigherSortOrders(sortOrder)
    }
    response.end()
  } catch (error) {
    response.status(500).send(error)
    console.error(error)
  }
}

// Get Sort Order
async function getSortOrder (id) {
  const query = 'SELECT sort_order AS sortorder FROM product WHERE id = $1'
  const { rows } = await db.query(query, [id])
  if (rows.length) {
    return rows[0]?.sortorder
  } else {
    return undefined
  }
}

// Update Higher Sort Orders
async function updateHigherSortOrders (sortOrder) {
  if (!sortOrder) {
    return
  }

  const query = 'UPDATE product SET sort_order = sort_order - 1 WHERE sort_order > $1'
  await db.query(query, [sortOrder])
}

function mapProduct (product) {
  return { ...product, sortOrder: product.sortorder, purchasedDate: product.purchaseddate }
}

export default { get, find, create, update, markPurchased, reorder, remove }
