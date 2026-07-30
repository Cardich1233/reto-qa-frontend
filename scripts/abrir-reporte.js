const { execFile } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const reporte = path.resolve(__dirname, '../reports/cucumber-report.html');

if (!fs.existsSync(reporte)) {
  console.error('Todavía no existe el reporte. Ejecuta primero: npm test');
  process.exit(1);
}

const comando =
  process.platform === 'win32' ? ['cmd', ['/c', 'start', '', reporte]] :
  process.platform === 'darwin' ? ['open', [reporte]] :
  ['xdg-open', [reporte]];

execFile(comando[0], comando[1], (error) => {
  if (error) console.error(`No se pudo abrir el reporte automáticamente. Ábrelo manualmente: ${reporte}`);
});
