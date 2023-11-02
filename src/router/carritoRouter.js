import express from 'express'
import productManager from '../dao/classesFS/productManager.js'
import cartManager from '../dao/classesFS/cartManager.js'

const cartRouter = express.Router();
const carts = cartManager.loadCartsFromFile();

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
export default cartRouter;