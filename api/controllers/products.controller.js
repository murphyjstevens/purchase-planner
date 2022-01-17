import db from '../db/index.js'

async function get (request, response) {
  try {
    const { rows } = await db.query('SELECT * FROM product')
    response.send(rows)
  } catch (e) {
    response.status(500).send(e)
  }
}

async function find (request, response) {
  const id = Number(request.params.id)
  if (!id || isNaN(id) || id < 1) {
    response.status(400).send('Id must be a positive integer')
    return
  }

  try {
    const { rows } = await db.query('SELECT * FROM product WHERE id = $1', [id])
    if (!rows.length) {
      response.status(404).end()
      return
    }

    response.send(rows[0])
  } catch (error) {
    response.status(500).send(error)
  }
}

async function create (request, response) {
  const product = {
    name: request.body.name,
    url: request.body.url
  }

  if (!product.name) {
    response.status(400).send('Name is required')
    return
  }

  const query = {
    text: `INSERT INTO product (name, url, last_modified)
            VALUES ($1, $2, now() at time zone 'utc')
            RETURNING *`,
    values: [product.name, product.url]
  }
  try {
    const { rows } = await db.query(query)
    response.send(rows[0])
  } catch (error) {
    response.status(500).send(error)
  }
}

async function update (request, response) {
  const product = {
    id: Number(request.body.id),
    name: request.body.name,
    url: request.body.url
  }

  const errors = []

  if (!product.id || isNaN(product.id) || product.id < 1) {
    errors.push('Id must be a positive integer')
  }
  if (!product.name) {
    errors.push('Name is required')
  }
  if (errors.length) {
    response.status(400).send(errors.join('\n'))
    return
  }

  const query = {
    text: `UPDATE product
            SET name = $2, url = $3, last_modified = now() at time zone 'utc'
            WHERE id = $1
            RETURNING *`,
    values: [product.id, product.name, product.url]
  }
  try {
    const { rows } = await db.query(query)
    response.send(rows[0])
  } catch (error) {
    response.status(500).send(error)
  }
}

async function remove (request, response) {
  const id = Number(request.params.id)
  if (!id || isNaN(id) || id < 1) {
    response.status(400).send('Id must be a positive integer')
    return
  }

  try {
    await db.query('DELETE FROM product WHERE id = $1', [id])
    response.end()
  } catch (error) {
    response.status(500).send(error)
  }
}

export default { get, find, create, update, remove }
