const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './src/data/carrito.json';

// Crear un nuevo carrito
router.post('/', (req, res) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer los carritos');
    }
    const carts = JSON.parse(data);
    const newCart = {
      id: String(carts.length + 1), // Asignar un nuevo ID
      products: []
    };
    carts.push(newCart);
    fs.writeFile(path, JSON.stringify(carts, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al guardar el carrito');
      }
      res.status(201).send('Carrito creado');
    });
  });
});

// Obtener los productos de un carrito por ID
router.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer los carritos');
    }
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cid);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.json(cart.products);
  });
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer los carritos');
    }
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id === cid);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    const existingProduct = cart.products.find(p => p.product === pid);
    if (existingProduct) {
      existingProduct.quantity += 1; // Incrementar la cantidad si el producto ya existe en el carrito
    } else {
      cart.products.push({ product: pid, quantity: 1 }); // Agregar nuevo producto
    }

    fs.writeFile(path, JSON.stringify(carts, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al actualizar el carrito');
      }
      res.send('Producto agregado al carrito');
    });
  });
});

module.exports = router;
