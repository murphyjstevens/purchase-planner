import db from '../db/index.js'

async function get (request, response) {
  try {
    const { rows } = await db.query('SELECT * FROM project')
    response.send(rows)
  } catch (e) {
    response.status(500).send(e)
  }
};

async function find (request, response) {
  const { id } = request.params
  if (!id) {
    response.status(400).end()
  }
  try {
    const { rows } = await db.query('SELECT * FROM project WHERE id = $1', [id])
    if (!rows.some()) {
      response.status(404).end()
    }
    response.send(rows[0])
  } catch (e) {
    response.status(500).send(e)
  }
};

function create (request, response) {
  response.send('products')
};

function remove (request, response) {
  console.log('delete' + request.params._id)
}

export default { get, find, create, remove }
