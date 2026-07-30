const { LoginPage } = require('./LoginPage');
const { InventoryPage } = require('./InventoryPage');
const { CartPage } = require('./CartPage');
const { CheckoutPage } = require('./CheckoutPage');

/**
 * Page Factory: instancia todos los Page Objects sobre una misma `page` y los
 * expone al World de Cucumber. Los steps nunca hacen `new XxxPage(...)`, sólo
 * consumen `this.pages.login`, `this.pages.inventario`, etc.
 */
class PageFactory {
  /** @param {import('playwright').Page} page */
  constructor(page) {
    this.login = new LoginPage(page);
    this.inventario = new InventoryPage(page);
    this.carrito = new CartPage(page);
    this.checkout = new CheckoutPage(page);
  }
}

module.exports = { PageFactory, LoginPage, InventoryPage, CartPage, CheckoutPage };
