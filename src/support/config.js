/**
 * Configuración centralizada de la suite.
 * Todos los valores son sobreescribibles por variables de entorno para que la
 * misma suite corra en local y en CI sin tocar código.
 */
const config = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com/',
  browser: process.env.BROWSER || 'chromium',
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number(process.env.SLOW_MO || 0),
  viewport: {
    width: Number(process.env.VIEWPORT_WIDTH || 1366),
    height: Number(process.env.VIEWPORT_HEIGHT || 768),
  },
  timeouts: {
    step: Number(process.env.STEP_TIMEOUT || 60000),
    expect: Number(process.env.EXPECT_TIMEOUT || 10000),
    navigation: Number(process.env.NAV_TIMEOUT || 30000),
  },
  // Evidencia: captura de pantalla y trace sólo cuando el escenario falla.
  capturarEvidenciaSiempre: process.env.EVIDENCIA_SIEMPRE === 'true',
};

module.exports = { config };
