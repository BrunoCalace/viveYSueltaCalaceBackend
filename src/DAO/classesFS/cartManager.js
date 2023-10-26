import fs from "fs";
const filePath = "./src/data/carts.json";

class CartManager {
  generateCartId() {
    const existingIds = carts.map((cart) => parseInt(cart.id));
    const newCartId =
      (existingIds.length > 0 ? Math.max(...existingIds) : 0) + 1;
    return newCartId.toString();
  }
  saveCartsToFile(carts) {
    const dataToSave = {
      carts: carts,
    };
    const jsonData = JSON.stringify(dataToSave, null, 2);
    try {
      fs.writeFileSync(filePath, jsonData, "utf8");
      console.log("Datos de carritos guardados correctamente");
    } catch (error) {
      console.error("Error al guardar datos de carritos:", error);
    }
  }
  loadCartsFromFile() {
    try {
      const jsonData = fs.readFileSync(filePath, "utf8");
      const loadedData = JSON.parse(jsonData);
      const loadedCarts = loadedData.carts;
      console.log("Datos de carritos cargados correctamente");
      return loadedCarts || [];
    } catch (error) {
      console.error("Error al cargar datos de carritos:", error);
      return [];
    }
  }
}

const cartManager = new CartManager();

export default cartManager;
