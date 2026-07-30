/**
 * Configuración del runner de Cucumber.
 * Se usa un único perfil `default`; el navegador, la URL y el modo headless
 * se controlan por variables de entorno (ver src/support/config.js).
 */
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['src/support/**/*.js', 'src/steps/**/*.js'],
    requireModule: [],
    format: [
      'summary',
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      printAttachments: false,
    },
    parallel: 0,
    retry: 0,
    strict: true,
  },
};
