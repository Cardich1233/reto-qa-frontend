const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');

Given('que el usuario está en la página de inicio de sesión', async function () {
  await this.pages.login.abrir();
});

Given('que el usuario ha iniciado sesión como {string}', async function (alias) {
  const { username, password } = this.credencialesDe(alias);
  await this.pages.login.abrir();
  await this.pages.login.iniciarSesion(username, password);
  assert.ok(
    await this.pages.inventario.estaEnLaPagina(),
    `No se pudo autenticar al usuario "${alias}". URL actual: ${await this.pages.login.urlActual()}`
  );
});

When('el usuario inicia sesión como {string}', async function (alias) {
  const { username, password } = this.credencialesDe(alias);
  await this.pages.login.iniciarSesion(username, password);
});

When('el usuario ingresa el usuario {string} y la contraseña {string}', async function (usuario, password) {
  await this.pages.login.ingresarCredenciales(usuario, password);
});

When('presiona el botón de inicio de sesión', async function () {
  await this.pages.login.presionarLogin();
});

When('el usuario cierra sesión', async function () {
  await this.pages.inventario.cerrarSesion();
});

Then('el usuario visualiza la página de productos', async function () {
  assert.ok(
    await this.pages.inventario.estaEnLaPagina(),
    `Se esperaba el catálogo de productos, pero la URL actual es ${await this.pages.inventario.urlActual()}`
  );
});

Then('el título de la sección es {string}', async function (tituloEsperado) {
  assert.equal(await this.pages.inventario.obtenerTitulo(), tituloEsperado);
});

Then('el catálogo muestra {int} productos', async function (cantidadEsperada) {
  assert.equal(await this.pages.inventario.cantidadDeProductos(), cantidadEsperada);
});

Then('se muestra el mensaje de error {string}', async function (mensajeEsperado) {
  assert.ok(
    await this.pages.login.hayMensajeError(),
    'No se mostró ningún mensaje de error en pantalla'
  );
  assert.equal(await this.pages.login.obtenerMensajeError(), mensajeEsperado);
});

Then('el usuario permanece en la página de inicio de sesión', async function () {
  assert.ok(
    await this.pages.login.estaEnLaPagina(),
    `Se esperaba seguir en el login, pero la URL actual es ${await this.pages.login.urlActual()}`
  );
});
