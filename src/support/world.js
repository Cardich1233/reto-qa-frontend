const { setWorldConstructor, World, setDefaultTimeout } = require('@cucumber/cucumber');
const playwright = require('playwright');
const { config } = require('./config');
const { PageFactory } = require('../pages');
const usuarios = require('../data/usuarios.json');
const datosCompra = require('../data/datosCompra.json');

setDefaultTimeout(config.timeouts.step);

/**
 * World personalizado (patrón Dependency Injection).
 * Cada escenario recibe su propio navegador, contexto y set de Page Objects,
 * garantizando aislamiento total entre escenarios.
 */
class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.pages = null;
    // Estado compartido entre steps del mismo escenario.
    this.datos = { usuarios, datosCompra, productosAgregados: [] };
  }

  async abrirNavegador() {
    this.browser = await playwright[config.browser].launch({
      headless: config.headless,
      slowMo: config.slowMo,
    });
    this.context = await this.browser.newContext({ viewport: config.viewport });
    this.context.setDefaultTimeout(config.timeouts.expect);
    this.context.setDefaultNavigationTimeout(config.timeouts.navigation);
    this.page = await this.context.newPage();
    this.pages = new PageFactory(this.page);
  }

  async cerrarNavegador() {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
    this.browser = this.context = this.page = this.pages = null;
  }

  /** Resuelve credenciales por alias desde el data pool. */
  credencialesDe(alias) {
    const usuario = this.datos.usuarios[alias];
    if (!usuario) {
      throw new Error(
        `El usuario "${alias}" no existe en src/data/usuarios.json. ` +
          `Disponibles: ${Object.keys(this.datos.usuarios).join(', ')}`
      );
    }
    return usuario;
  }
}

setWorldConstructor(CustomWorld);

module.exports = { CustomWorld };
