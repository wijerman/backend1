const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();

app.use(express.json()); 
// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

module.exports = app;
