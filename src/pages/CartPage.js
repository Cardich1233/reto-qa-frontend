const { BasePage } = require('./BasePage');

/** Carrito de compras (/cart.html). */
class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.titulo = page.locator('.title');
    this.items = page.locator('.cart_item');
    this.nombresItem = page.locator('.cart_item .inventory_item_name');
    this.btnCheckout = page.locator('#checkout');
    this.btnSeguirComprando = page.locator('#continue-shopping');
  }

  filaDe(nombreProducto) {
    return this.items.filter({
      has: this.page.getByText(nombreProducto, { exact: true }),
    });
  }

  async estaEnLaPagina() {
    return (await this.urlActual()).includes('/cart.html');
  }

  async obtenerTitulo() {
    return this.textoDe(this.titulo);
  }

  async listarProductos() {
    if ((await this.items.count()) === 0) return [];
    return (await this.nombresItem.allTextContents()).map((texto) => texto.trim());
  }

  async cantidadDeItems() {
    return this.items.count();
  }

  async cantidadDe(nombreProducto) {
    return this.textoDe(this.filaDe(nombreProducto).locator('.cart_quantity'));
  }

  async eliminarProducto(nombreProducto) {
    await this.clickear(this.filaDe(nombreProducto).locator('button'));
  }

  async irACheckout() {
    await this.clickear(this.btnCheckout);
  }
}

module.exports = { CartPage };
