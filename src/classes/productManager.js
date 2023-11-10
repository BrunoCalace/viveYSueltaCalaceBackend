import prodModel from '../models/prodModels'


class ProductManager {
    addToCart(id, title, price, thumbnails) {
      const cantidad = 1;
      const data = { id, title, price, cantidad, thumbnails }
  
      console.log(data);
  
      return fetch('/api/cart/agregar-a-lista', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.status === 200) {
            alert('Producto agregado al carrito con éxito')
          } else {
            alert('No se pudo agregar el producto a la lista')
          }
        })
        .catch((error) => {
          console.error('Error en la solicitud de agregar a la lista:', error)
          alert('Error en la solicitud de agregar a la lista')
        });
    }

    deleteProduct(id) {
        return fetch(`/api/products/${id}`, { method: 'DELETE' })
          .then((response) => {
            if (response.ok) {
                alert('Eliminado con éxito')
            } else {
                alert('No se pudo eliminar')
            }
          })
          .catch((error) => {
            console.error('Error al eliminar el producto:', error)
            alert('Error al eliminar el producto')
          });
      }
    }
  
export default ProductManager