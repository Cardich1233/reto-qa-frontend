# language: es
@carrito
Característica: Gestión del carrito de compras
  Como cliente autenticado de Sauce Demo
  Quiero agregar productos al carrito y revisarlos
  Para confirmar qué voy a comprar antes de pagar

  Antecedentes:
    Dado que el usuario ha iniciado sesión como "standard_user"

  @smoke @positivo @CA03
  Escenario: Agregar un producto al carrito desde la página de productos
    Cuando agrega el producto "Sauce Labs Backpack" al carrito
    Entonces el contador del carrito muestra "1"
    Y el botón del producto "Sauce Labs Backpack" cambia a "Remove"

  @positivo @CA03
  Esquema del escenario: Agregar distintos productos al carrito
    Cuando agrega el producto "<producto>" al carrito
    Entonces el contador del carrito muestra "1"

    Ejemplos:
      | producto                          |
      | Sauce Labs Bike Light             |
      | Sauce Labs Bolt T-Shirt           |
      | Sauce Labs Fleece Jacket          |
      | Sauce Labs Onesie                 |
      | Test.allTheThings() T-Shirt (Red) |

  @smoke @positivo @CA04
  Escenario: Visualizar en el carrito los productos agregados
    Dado que agregó los siguientes productos al carrito:
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    Cuando abre el carrito de compras
    Entonces el carrito contiene los siguientes productos:
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    Y el carrito muestra 2 productos
    Y la cantidad del producto "Sauce Labs Backpack" en el carrito es "1"

  @positivo
  Escenario: Eliminar un producto del carrito
    Dado que agregó los siguientes productos al carrito:
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    Cuando abre el carrito de compras
    Y elimina el producto "Sauce Labs Backpack" del carrito
    Entonces el carrito muestra 1 productos
    Y el carrito no contiene el producto "Sauce Labs Backpack"
    Y el contador del carrito muestra "1"

  @positivo
  Escenario: El carrito inicia vacío para una sesión nueva
    Cuando abre el carrito de compras
    Entonces el carrito muestra 0 productos
