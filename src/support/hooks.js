const fs = require('fs');
const path = require('path');
const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const { config } = require('./config');

const DIR_REPORTES = path.resolve(__dirname, '../../reports');
const DIR_EVIDENCIAS = path.join(DIR_REPORTES, 'evidencias');

BeforeAll(function () {
  fs.mkdirSync(DIR_EVIDENCIAS, { recursive: true });
});

/** Un navegador limpio por escenario: sin sesión ni carrito heredados. */
Before(async function () {
  await this.abrirNavegador();
});

/**
 * Evidencia: siempre que el escenario falla se adjunta la captura al reporte
 * HTML y se guarda una copia en reports/evidencias.
 */
After(async function ({ pickle, result }) {
  const fallo = result && result.status === Status.FAILED;

  if (this.page && (fallo || config.capturarEvidenciaSiempre)) {
    try {
      const captura = await this.page.screenshot({ fullPage: true });
      const estado = fallo ? 'FAIL' : 'OK';
      const nombre = `${estado}-${pickle.name.replace(/[^\w\dáéíóúñ ]/gi, '').slice(0, 60).trim().replace(/\s+/g, '_')}.png`;
      fs.writeFileSync(path.join(DIR_EVIDENCIAS, nombre), captura);
      this.attach(captura, 'image/png');
      this.attach(`URL al finalizar: ${this.page.url()}`, 'text/plain');
    } catch (error) {
      console.warn('No se pudo capturar la evidencia:', error.message);
    }
  }

  await this.cerrarNavegador();
});

AfterAll(function () {
  console.log(`\nReporte HTML: ${path.join(DIR_REPORTES, 'cucumber-report.html')}`);
});
