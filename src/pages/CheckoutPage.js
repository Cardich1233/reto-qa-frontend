const { BasePage } = require('./BasePage');

/**
 * Proceso de compra: cubre los tres pasos del flujo
 * (/checkout-step-one.html, /checkout-step-two.html y /checkout-complete.html).
 */
class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    // Paso 1 — Información del comprador
    this.inputNombre = page.locator('#first-name');
    this.inputApellido = page.locator('#last-name');
    this.inputCodigoPostal = page.locator('#postal-code');
    this.btnContinuar = page.locator('#continue');
    this.btnCancelar = page.locator('#cancel');
    this.mensajeError = page.locator('[data-test="error"]');

    // Paso 2 — Resumen de la orden
    this.items = page.locator('.cart_item');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.impuesto = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.btnFinalizar = page.locator('#finish');

    // Paso 3 — Confirmación
    this.tituloConfirmacion = page.locator('.complete-header');
    this.textoConfirmacion = page.locator('.complete-text');
    this.btnVolverAProductos = page.locator('#back-to-products');
    this.titulo = page.locator('.title');
  }

  async completarDatosPersonales({ nombre, apellido, codigoPostal }) {
    await this.escribir(this.inputNombre, nombre);
    await this.escribir(this.inputApellido, apellido);
    await this.escribir(this.inputCodigoPostal, codigoPostal);
  }

  async continuar() {
    await this.clickear(this.btnContinuar);
  }

  async finalizarCompra() {
    await this.clickear(this.btnFinalizar);
  }

  async obtenerMensajeError() {
    return this.textoDe(this.mensajeError);
  }

  async obtenerTitulo() {
    return this.textoDe(this.titulo);
  }

  async obtenerMensajeConfirmacion() {
    return this.textoDe(this.tituloConfirmacion);
  }

  async compraConfirmada() {
    return this.estaVisible(this.tituloConfirmacion);
  }

  async listarProductosDelResumen() {
    return (await this.items.locator('.inventory_item_name').allTextContents()).map((t) => t.trim());
  }

  /** Extrae el importe numérico de una etiqueta del resumen (ej. "Total: $32.39"). */
  async importeDe(locator) {
    const texto = await this.textoDe(locator);
    const match = texto.match(/[\d.]+/);
    return match ? Number(match[0]) : NaN;
  }

  async obtenerSubtotal() {
    return this.importeDe(this.subtotal);
  }

  async obtenerImpuesto() {
    return this.importeDe(this.impuesto);
  }

  async obtenerTotal() {
    return this.importeDe(this.total);
  }
}

module.exports = { CheckoutPage };
