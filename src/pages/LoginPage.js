const { BasePage } = require('./BasePage');

/** Página de inicio de sesión (https://www.saucedemo.com/). */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.inputUsuario = page.locator('#user-name');
    this.inputPassword = page.locator('#password');
    this.btnLogin = page.locator('#login-button');
    this.mensajeError = page.locator('[data-test="error"]');
  }

  async abrir() {
    await this.navegarA('/');
    await this.inputUsuario.waitFor({ state: 'visible' });
  }

  async ingresarCredenciales(usuario, password) {
    await this.escribir(this.inputUsuario, usuario);
    await this.escribir(this.inputPassword, password);
  }

  async presionarLogin() {
    await this.clickear(this.btnLogin);
  }

  /** Flujo completo de autenticación. */
  async iniciarSesion(usuario, password) {
    await this.ingresarCredenciales(usuario, password);
    await this.presionarLogin();
  }

  async hayMensajeError() {
    return this.estaVisible(this.mensajeError);
  }

  async obtenerMensajeError() {
    return this.textoDe(this.mensajeError);
  }

  async estaEnLaPagina() {
    return this.estaVisible(this.btnLogin);
  }
}

module.exports = { LoginPage };
