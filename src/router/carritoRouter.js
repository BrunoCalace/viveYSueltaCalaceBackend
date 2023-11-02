import express from 'express'
import productManager from '../dao/classesFS/productManager.js'
import cartManager from '../dao/classesFS/cartManager.js'

const cartRouter = express.Router();
const carts = cartManager.loadCartsFromFile();

cartRouter.get("/:cid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.post("/", (req, res) => {
  try {
    const newCartId = cartManager.generateCartId();
    const newCart = {
      id: newCartId,
      products: [],
    };
    carts.push(newCart);
    cartManager.saveCartsToFile(carts);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.post("/:cid/product/:pid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = 1;
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }
    const productToAdd = productManager.getProductById(productId);
    if (!productToAdd) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    const existingProduct = cart.products.find(
      (product) => product.productId === productId
    );
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ productId, quantity });
    }
    cartManager.saveCartsToFile(carts);
    res.status(201).json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.delete("/:cid/products/:pid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }
    const productIndex = cart.products.findIndex(
      (product) => product.productId === productId
    );
    if (productIndex === -1) {
      res.status(404).json({ error: "Producto no encontrado en el carrito" });
      return;
    }
    cart.products.splice(productIndex, 1);
    cartManager.saveCartsToFile(carts);
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.put("/:cid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const newProducts = req.body.products; // Asume que se envía un arreglo de productos
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }
    cart.products = newProducts;
    cartManager.saveCartsToFile(carts);
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.put("/:cid/products/:pid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity; // Asume que se envía la nueva cantidad
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }
    const productToUpdate = cart.products.find(
      (product) => product.productId === productId
    );
    if (!productToUpdate) {
      res.status(404).json({ error: "Producto no encontrado en el carrito" });
      return;
    }
    productToUpdate.quantity = quantity;
    cartManager.saveCartsToFile(carts);
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.delete("/:cid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }
    cart.products = [];
    cartManager.saveCartsToFile(carts);
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

cartRouter.delete("/:cid/products/:pid", (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      res.status(404).json({ error: "Carrito no encontrado" });
      return;
    }
    const productIndex = cart.products.findIndex(
      (product) => product.productId === productId
    );
    if (productIndex === -1) {
      res.status(404).json({ error: "Producto no encontrado en el carrito" });
      return;
    }
    cart.products.splice(productIndex, 1);
    cartManager.saveCartsToFile(carts);
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default cartRouter;