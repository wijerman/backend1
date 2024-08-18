const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsFilePath = path.join(__dirname, '../data/productos.json');

// Helper function to read products data from JSON file
const readProductsFile = () => {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
};

// Ruta GET /api/products/
router.get('/', (req, res) => {
    const products = readProductsFile();
    let result = products;

    if (req.query.limit) {
        result = products.slice(0, req.query.limit);
    }

    res.json(result);
});

// Ruta GET /api/products/:pid
router.get('/:pid', (req, res) => {
    const products = readProductsFile();
    const product = products.find(p => p.id === req.params.pid);

    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

// Ruta POST /api/products/
router.post('/', (req, res) => {
    const products = readProductsFile();
    const newProduct = {
        id: `${Date.now()}`,
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status || true,
        stock: req.body.stock,
        category: req.body.category,
        thumbnails: req.body.thumbnails || [],
    };

    products.push(newProduct);

    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
});

module.exports = router;
