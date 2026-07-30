const { config } = require('../support/config');

/**
 * Clase base del Page Object Model.
 * Concentra las interacciones comunes con Playwright para que las páginas hijas
 * sólo declaren selectores y acciones propias del negocio.
 */
class BasePage {
  /** @param {import('playwright').Page} page */
  constructor(page) {
    this.page = page;
    this.baseUrl = config.baseUrl;
  }

  /** Navega a una ruta relativa a la baseUrl. */
  async navegarA(ruta = '') {
    const destino = new URL(ruta, this.baseUrl).toString();
    await this.page.goto(destino, {
      waitUntil: 'domcontentloaded',
      timeout: config.timeouts.navigation,
    });
  }

  async escribir(locator, texto) {
    await locator.waitFor({ state: 'visible', timeout: config.timeouts.expect });
    await locator.fill(texto);
  }

  async clickear(locator) {
    await locator.waitFor({ state: 'visible', timeout: config.timeouts.expect });
    await locator.click();
  }

  async textoDe(locator) {
    await locator.waitFor({ state: 'visible', timeout: config.timeouts.expect });
    return (await locator.textContent()).trim();
  }

  async estaVisible(locator, timeout = config.timeouts.expect) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      return false;
    }
  }

  async urlActual() {
    return this.page.url();
  }
}

module.exports = { BasePage };
