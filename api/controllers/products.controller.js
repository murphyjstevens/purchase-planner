import db from '../db/index.js';

async function get(request, response) {
  try {
    const { rows } = await db.query('SELECT * FROM project');
    response.send(rows);
  } catch (e) {
    response.status(500).send(e);
  }
};

async function find(request, response) {
  const { id } = request.params;
  const { rows } = await db.query('SELECT * FROM project WHERE id = $1', [id]);
  response.send(rows[0]);
};

function create(request, response) {
  response.send('products');
};

function remove(request, response) {
  console.log('delete' + request.params._id);
}

export default { get, find, create, remove };