const express = require('express');
const crypto = require("crypto");
const cors = require('cors');

const app = express();
const port = 3000;

const getResponder = res => (message, status = 200) => {
    res.statusCode = status;
    res.send(JSON.stringify(message));
}

const state = {
    products: [],
    categories: [
        {id: 1, name: 'Smrtphones'},
        {id: 2, name: 'Laptops'},
        {id: 3, name: 'TVs'},
    ]
}

// Middlewares
app.use(cors());
app.use(express.json());


// Endpoints
app.get('/', (req, res) => {
  res.send('It works')
});

app.get('/products', (req, res) => {
    const respond = getResponder(res);
    respond(state.products);
});

app.get('/product/:id', (req, res) => {
    const respond = getResponder(res);
    const { id } = req.params;
    const product = state.products.find(product => product.id === id);
    if (product) {
        return respond(product);
    }
    respond({error: 'Product does not exist'}, 400);
});

app.post('/product', (req, res) => {
    const respond = getResponder(res);
    const { name, cost, categoryId } = req.body;
    const category = state.categories.find(category => category.id === categoryId);
    const id = crypto.randomBytes(16).toString("hex");
    if (!category || !cost || !name) {
        return respond({error: 'Bad request'}, 400);
    }
    state.products.push({
        name,
        cost,
        categoryId,
        id
    });
    respond({ id }, 200);
});

app.put('/product/:id', (req, res) => {
    const respond = getResponder(res);
    const { id } = req.params;
    const { name, cost, categoryId } = req.body;
    const category = state.categories.find(category => category.id === categoryId);
    const product = state.products.find(product => product.id === id);
    if (!category || !cost || !name || !product) {
        return respond({error: 'Bad request'}, 400);
    }
    product.name = name;
    product.cost = cost;
    product.categoryId = categoryId;
    respond({ id }, 200);
});

app.delete('/product/:id', (req, res) => {
    const respond = getResponder(res);
    const { id } = req.params;
    const product = state.products.find(product => product.id === id);
    if (!product) {
        return respond({error: 'Bad request'}, 400);
    }
    state.products = state.products.filter(product => product.id !== id);
    respond({ products: state.products }, 200);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});