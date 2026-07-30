const assert = require('node:assert/strict');
const { When, Then } = require('@cucumber/cucumber');

When('continúa con el proceso de compra', async function () {
  await this.pages.carrito.irACheckout();
  assert.ok(
    await this.pages.checkout.estaVisible(this.pages.checkout.inputNombre),
    'No se llegó al formulario de datos del comprador'
  );
});

When('completa el formulario de compra con los datos {string}', async function (alias) {
  const datos = this.datos.datosCompra[alias];
  assert.ok(datos, `No existe el juego de datos "${alias}" en src/data/datosCompra.json`);
  await this.pages.checkout.completarDatosPersonales(datos);
  await this.pages.checkout.continuar();
});

When(
  'completa el formulario de compra con nombre {string}, apellido {string} y código postal {string}',
  async function (nombre, apellido, codigoPostal) {
    await this.pages.checkout.completarDatosPersonales({ nombre, apellido, codigoPostal });
    await this.pages.checkout.continuar();
  }
);

When('finaliza la compra', async function () {
  await this.pages.checkout.finalizarCompra();
});

Then('el resumen de la compra contiene los siguientes productos:', async function (dataTable) {
  const esperados = dataTable.raw().map(([nombre]) => nombre);
  const enResumen = await this.pages.checkout.listarProductosDelResumen();
  assert.equal(
    enResumen.length,
    esperados.length,
    `El resumen tiene ${enResumen.length} productos y se esperaban ${esperados.length}`
  );
  for (const producto of esperados) {
    assert.ok(
      enResumen.includes(producto),
      `"${producto}" no aparece en el resumen. Contenido: ${enResumen.join(' | ')}`
    );
  }
});

Then('el total de la compra corresponde al subtotal más el impuesto', async function () {
  const subtotal = await this.pages.checkout.obtenerSubtotal();
  const impuesto = await this.pages.checkout.obtenerImpuesto();
  const total = await this.pages.checkout.obtenerTotal();
  const esperado = Number((subtotal + impuesto).toFixed(2));
  assert.equal(
    total,
    esperado,
    `Total mostrado ${total} != subtotal ${subtotal} + impuesto ${impuesto} (= ${esperado})`
  );
});

Then('se muestra el mensaje de confirmación {string}', async function (mensajeEsperado) {
  assert.ok(await this.pages.checkout.compraConfirmada(), 'No se llegó a la pantalla de confirmación');
  assert.equal(await this.pages.checkout.obtenerMensajeConfirmacion(), mensajeEsperado);
});

Then('el carrito queda vacío', async function () {
  assert.equal(
    await this.pages.inventario.obtenerContadorCarrito(),
    '0',
    'El contador del carrito debería quedar en cero luego de finalizar la compra'
  );
});
