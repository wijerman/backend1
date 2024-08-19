const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './src/data/productos.json';

// Obtener todos los productos
router.get('/', (req, res) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer los productos');
    }
    let products = JSON.parse(data);
    const limit = req.query.limit;
    if (limit) {
      products = products.slice(0, limit);
    }
    res.json(products);
  });
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
  const pid = req.params.pid;
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer los productos');
    }
    const products = JSON.parse(data);
    const product = products.find(p => p.id === pid);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(product);
  });
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
  const newProduct = req.body;
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer los productos');
    }
    const products = JSON.parse(data);
    newProduct.id = String(products.length + 1); // Asignar un nuevo ID
    products.push(newProduct);
    fs.writeFile(path, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al guardar el producto');
      }
      res.status(201).send('Producto agregado');
    });
  });
});

// Actualizar un producto por ID
router.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer los productos');
    }
    const products = JSON.parse(data);
    const index = products.findIndex(p => p.id === pid);
    if (index === -1) {
      return res.status(404).send('Producto no encontrado');
    }
    const product = products[index];
    const updated = { ...product, ...updatedProduct, id: product.id }; // Asegurar que el ID no se actualice
    products[index] = updated;
    fs.writeFile(path, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al actualizar el producto');
      }
      res.send('Producto actualizado');
    });
  });
});

// Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error al leer los productos');
    }
    let products = JSON.parse(data);
    products = products.filter(p => p.id !== pid);
    fs.writeFile(path, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error al eliminar el producto');
      }
      res.send('Producto eliminado');
    });
  });
});

module.exports = router;
