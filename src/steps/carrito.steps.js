const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');

Given('que agregó los siguientes productos al carrito:', async function (dataTable) {
  const productos = dataTable.raw().map(([nombre]) => nombre);
  for (const producto of productos) {
    await this.pages.inventario.agregarProducto(producto);
    this.datos.productosAgregados.push(producto);
  }
  assert.equal(
    await this.pages.inventario.obtenerContadorCarrito(),
    String(productos.length),
    'El contador del carrito no refleja todos los productos agregados'
  );
});

When('agrega el producto {string} al carrito', async function (producto) {
  await this.pages.inventario.agregarProducto(producto);
  this.datos.productosAgregados.push(producto);
});

When('abre el carrito de compras', async function () {
  await this.pages.inventario.abrirCarrito();
  assert.ok(
    await this.pages.carrito.estaEnLaPagina(),
    `No se abrió el carrito. URL actual: ${await this.pages.carrito.urlActual()}`
  );
});

When('elimina el producto {string} del carrito', async function (producto) {
  await this.pages.carrito.eliminarProducto(producto);
  this.datos.productosAgregados = this.datos.productosAgregados.filter((p) => p !== producto);
});

Then('el contador del carrito muestra {string}', async function (cantidadEsperada) {
  assert.equal(await this.pages.inventario.obtenerContadorCarrito(), cantidadEsperada);
});

Then('el botón del producto {string} cambia a {string}', async function (producto, textoEsperado) {
  assert.equal(await this.pages.inventario.textoBotonDe(producto), textoEsperado);
});

Then('el carrito contiene los siguientes productos:', async function (dataTable) {
  const esperados = dataTable.raw().map(([nombre]) => nombre);
  const enCarrito = await this.pages.carrito.listarProductos();
  for (const producto of esperados) {
    assert.ok(
      enCarrito.includes(producto),
      `"${producto}" no está en el carrito. Contenido actual: ${enCarrito.join(' | ') || '(vacío)'}`
    );
  }
});

Then('el carrito no contiene el producto {string}', async function (producto) {
  const enCarrito = await this.pages.carrito.listarProductos();
  assert.ok(
    !enCarrito.includes(producto),
    `"${producto}" sigue presente en el carrito: ${enCarrito.join(' | ')}`
  );
});

Then('el carrito muestra {int} productos', async function (cantidadEsperada) {
  assert.equal(await this.pages.carrito.cantidadDeItems(), cantidadEsperada);
});

Then('la cantidad del producto {string} en el carrito es {string}', async function (producto, cantidad) {
  assert.equal(await this.pages.carrito.cantidadDe(producto), cantidad);
});
