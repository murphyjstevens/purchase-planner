function get(request, response) {
  response.send('products');
}

function create(request, response) {
  response.send('products');
}

export default { get, create };