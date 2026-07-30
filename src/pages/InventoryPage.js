const { BasePage } = require('./BasePage');

/** Catálogo de productos (/inventory.html). */
class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.titulo = page.locator('.title');
    this.productos = page.locator('.inventory_item');
    this.iconoCarrito = page.locator('.shopping_cart_link');
    this.contadorCarrito = page.locator('.shopping_cart_badge');
    this.botonMenu = page.locator('#react-burger-menu-btn');
    this.linkLogout = page.locator('#logout_sidebar_link');
  }

  /** Devuelve el contenedor de un producto buscándolo por su nombre exacto. */
  tarjetaDe(nombreProducto) {
    return this.productos.filter({
      has: this.page.getByText(nombreProducto, { exact: true }),
    });
  }

  botonAgregarDe(nombreProducto) {
    return this.tarjetaDe(nombreProducto).locator('button');
  }

  async estaEnLaPagina() {
    return (await this.estaVisible(this.productos.first())) && (await this.urlActual()).includes('/inventory.html');
  }

  async cantidadDeProductos() {
    await this.productos.first().waitFor({ state: 'visible' });
    return this.productos.count();
  }

  async agregarProducto(nombreProducto) {
    await this.clickear(this.botonAgregarDe(nombreProducto));
  }

  async textoBotonDe(nombreProducto) {
    return this.textoDe(this.botonAgregarDe(nombreProducto));
  }

  async obtenerContadorCarrito() {
    if (!(await this.estaVisible(this.contadorCarrito, 3000))) return '0';
    return this.textoDe(this.contadorCarrito);
  }

  async abrirCarrito() {
    await this.clickear(this.iconoCarrito);
  }

  async cerrarSesion() {
    await this.clickear(this.botonMenu);
    await this.clickear(this.linkLogout);
  }

  async obtenerTitulo() {
    return this.textoDe(this.titulo);
  }
}

module.exports = { InventoryPage };
