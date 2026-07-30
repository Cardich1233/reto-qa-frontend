# language: es
@compra
Característica: Proceso de compra hasta la confirmación
  Como cliente autenticado de Sauce Demo
  Quiero completar el proceso de compra de los productos de mi carrito
  Para adquirir los productos que necesito

  Antecedentes:
    Dado que el usuario ha iniciado sesión como "standard_user"

  @smoke @positivo @CA05
  Escenario: Completar la compra de un producto hasta la confirmación
    Dado que agregó los siguientes productos al carrito:
      | Sauce Labs Backpack |
    Cuando abre el carrito de compras
    Y continúa con el proceso de compra
    Y completa el formulario de compra con los datos "valido"
    Entonces el resumen de la compra contiene los siguientes productos:
      | Sauce Labs Backpack |
    Y el total de la compra corresponde al subtotal más el impuesto
    Cuando finaliza la compra
    Entonces se muestra el mensaje de confirmación "Thank you for your order!"
    Y el carrito queda vacío

  @positivo @CA05
  Escenario: Completar la compra de varios productos
    Dado que agregó los siguientes productos al carrito:
      | Sauce Labs Backpack      |
      | Sauce Labs Bike Light    |
      | Sauce Labs Fleece Jacket |
    Cuando abre el carrito de compras
    Y continúa con el proceso de compra
    Y completa el formulario de compra con los datos "valido"
    Entonces el resumen de la compra contiene los siguientes productos:
      | Sauce Labs Backpack      |
      | Sauce Labs Bike Light    |
      | Sauce Labs Fleece Jacket |
    Cuando finaliza la compra
    Entonces se muestra el mensaje de confirmación "Thank you for your order!"

  @negativo
  Esquema del escenario: El formulario de compra exige los datos obligatorios
    Dado que agregó los siguientes productos al carrito:
      | Sauce Labs Backpack |
    Cuando abre el carrito de compras
    Y continúa con el proceso de compra
    Y completa el formulario de compra con nombre "<nombre>", apellido "<apellido>" y código postal "<codigoPostal>"
    Entonces se muestra el mensaje de error "<mensaje>"

    Ejemplos:
      | caso                | nombre    | apellido | codigoPostal | mensaje                          |
      | sin nombre          |           | Cardenas | 15001        | Error: First Name is required    |
      | sin apellido        | Sebastian |          | 15001        | Error: Last Name is required     |
      | sin código postal   | Sebastian | Cardenas |              | Error: Postal Code is required   |
