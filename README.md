# Reto de Automatización QA — FrontEnd (Sauce Demo)

[![E2E Sauce Demo](https://github.com/Cardich1233/reto-qa-frontend/actions/workflows/e2e.yml/badge.svg)](https://github.com/Cardich1233/reto-qa-frontend/actions/workflows/e2e.yml)

Suite de pruebas E2E de [Sauce Demo](https://www.saucedemo.com/) construida con
**Playwright + Cucumber (Gherkin)** y **Page Object Model**.

> Estado actual: **22 escenarios / 109 steps — 100 % en verde** (~25 s).

---

## 1. Requisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 18 (probado en 24.14) |
| npm | 9 |

No hace falta instalar navegadores a mano: `npm install` descarga Chromium
automáticamente mediante el hook `postinstall`.

---

## 2. Instalación

```bash
npm install
```

---

## 3. Ejecución

```bash
npm test
```

| Comando | Qué ejecuta |
|---|---|
| `npm test` | Toda la suite (headless) |
| `npm run test:headed` | Toda la suite con navegador visible |
| `npm run test:smoke` | Sólo los escenarios `@smoke` (camino feliz de cada CA) |
| `npm run test:login` | Sólo la característica de inicio de sesión |
| `npm run test:carrito` | Sólo la característica de carrito |
| `npm run test:compra` | Sólo la característica de compra |
| `npm run test:positivo` | Sólo los escenarios positivos |
| `npm run test:negativo` | Sólo los escenarios negativos |

Filtrado libre por etiquetas:

```bash
npx cucumber-js --tags "@carrito and @positivo"
```

---

## 4. Reportes y evidencias

Después de cada corrida se generan:

| Artefacto | Ruta |
|---|---|
| Reporte HTML | `reports/cucumber-report.html` |
| Reporte JSON (para CI) | `reports/cucumber-report.json` |
| Capturas de escenarios fallidos | `reports/evidencias/FAIL-*.png` |

Cada escenario que falla adjunta automáticamente su captura de pantalla y la URL
final dentro del reporte HTML.

---

## 5. Configuración por variables de entorno

Todo es sobreescribible sin tocar código (ver `src/support/config.js`):

| Variable | Por defecto | Descripción |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com/` | URL bajo prueba |
| `BROWSER` | `chromium` | `chromium`, `firefox` o `webkit` |
| `HEADLESS` | `true` | `false` para ver el navegador |
| `SLOW_MO` | `0` | Milisegundos de retardo entre acciones (depuración) |
| `STEP_TIMEOUT` | `60000` | Timeout de cada step |
| `EXPECT_TIMEOUT` | `10000` | Timeout de espera de elementos |
| `EVIDENCIA_SIEMPRE` | `false` | `true` para capturar también los escenarios exitosos |

Ejemplo:

```bash
npx cross-env BROWSER=firefox HEADLESS=false npm test
```

---

## 6. Estructura del proyecto

```
frontend-saucedemo/
├── cucumber.js                  # Configuración del runner
├── features/                    # Especificación en Gherkin (español)
│   ├── login.feature
│   ├── carrito.feature
│   └── compra.feature
├── src/
│   ├── pages/                   # Page Object Model
│   │   ├── BasePage.js          #   interacciones comunes con Playwright
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   └── index.js             #   Page Factory
│   ├── steps/                   # Step definitions (una por característica)
│   │   ├── login.steps.js
│   │   ├── carrito.steps.js
│   │   └── compra.steps.js
│   ├── support/
│   │   ├── config.js            #   configuración centralizada
│   │   ├── world.js             #   World personalizado (inyección de dependencias)
│   │   └── hooks.js             #   ciclo de vida + evidencias
│   └── data/                    # Datos de prueba externalizados
│       ├── usuarios.json
│       └── datosCompra.json
├── .github/workflows/e2e.yml    # Integración continua
└── reports/                     # Generado en cada corrida
```

---

## 7. Cobertura de los criterios de aceptación

| # | Criterio de aceptación | Dónde se cubre | Etiqueta |
|---|---|---|---|
| 1 | Iniciar sesión con credenciales válidas | `login.feature` | `@CA01` |
| 2 | No iniciar sesión con credenciales inválidas | `login.feature` (usuario bloqueado + 5 combinaciones) | `@CA02` |
| 3 | Agregar un producto al carrito | `carrito.feature` (6 productos) | `@CA03` |
| 4 | Ver los productos agregados en el carrito | `carrito.feature` | `@CA04` |
| 5 | Completar la compra hasta la confirmación | `compra.feature` (1 y 3 productos) | `@CA05` |

Usuarios exigidos por el reto: `standard_user` y `locked_out_user`, ambos
definidos en `src/data/usuarios.json`.

---

## 8. Integración continua (GitHub Actions)

El workflow [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml) ejecuta la
suite completa en Ubuntu con Chromium.

| Disparador | Cuándo |
|---|---|
| `push` a `main` | En cada integración |
| `pull_request` a `main` | Antes de aprobar cualquier cambio |
| `schedule` | Regresión de lunes a viernes, 07:00 hora de Lima |
| `workflow_dispatch` | Ejecución manual desde la pestaña **Actions**, con filtro opcional de etiquetas (ej. `@smoke`) |

Cada ejecución deja:

- Un **resumen** con el conteo de escenarios en la portada del run.
- Un **artefacto** (`reporte-cucumber-N`) con el reporte HTML y las capturas de
  los escenarios fallidos, descargable durante 14 días.

---

## 9. Informe de estrategia

El detalle de la estrategia de automatización y los patrones aplicados está en
[ESTRATEGIA.md](ESTRATEGIA.md).
