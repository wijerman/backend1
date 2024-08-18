const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const cartsFilePath = path.join(__dirname, '../data/carrito.json');

// Helper function to read carts data from JSON file
const readCartsFile = () => {
    const data = fs.readFileSync(cartsFilePath, 'utf8');
    return JSON.parse(data);
};

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
    const carts = readCartsFile();
    const cart = carts.find(c => c.id === req.params.cid);

    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCartsFile();
    const cart = carts.find(c => c.id === req.params.cid);

    if (cart) {
        const product = cart.products.find(p => p.product === req.params.pid);

        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({
                product: req.params.pid,
                quantity: 1,
            });
        }

        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
        res.status(201).json(cart);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

module.exports = router;
