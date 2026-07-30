# Informe de estrategia — Reto FrontEnd (Sauce Demo)

## 1. Objetivo y alcance

Automatizar el flujo de compra de Sauce Demo —inicio de sesión, gestión del
carrito y checkout— con una suite legible por perfiles no técnicos, mantenible
en el tiempo y ejecutable en CI.

**Alcance:** 3 características, 22 escenarios, 109 steps. Cubre los 5 criterios
de aceptación del reto, más casos negativos y de regresión que no estaban
explícitamente pedidos pero que sostienen la confianza en el flujo.

---

## 2. Stack

| Componente | Elección | Por qué |
|---|---|---|
| Driver | Playwright | Auto-waiting nativo: elimina los `sleep` y la principal fuente de flakiness |
| BDD | @cucumber/cucumber 11 | Requisito del reto; separa la especificación de la implementación |
| Aserciones | `node:assert/strict` | Sin dependencias extra; mensajes de error personalizados por aserción |
| Reporte | Formatter HTML nativo de Cucumber | Cero dependencias; adjunta capturas de pantalla |

---

## 3. Patrones de diseño aplicados

### 3.1 Page Object Model (patrón principal exigido)

Cada pantalla es una clase que encapsula **selectores** y **acciones de
negocio**. Los feature files y los steps no conocen ni un solo selector CSS.

```
BasePage ──► LoginPage · InventoryPage · CartPage · CheckoutPage
```

`BasePage` centraliza la interacción con Playwright (`navegarA`, `escribir`,
`clickear`, `textoDe`, `estaVisible`). Consecuencia práctica: un cambio en la
política de esperas se aplica a las 4 páginas modificando un solo archivo.

**Criterio de diseño:** los métodos exponen intención de negocio
(`iniciarSesion`, `agregarProducto`, `completarDatosPersonales`), no mecánica de
UI. Los locators se declaran en el constructor, en un único lugar por pantalla.

### 3.2 Page Factory + Inyección de dependencias

`PageFactory` (`src/pages/index.js`) instancia todos los Page Objects sobre la
misma `page` y los inyecta en el World de Cucumber. Los steps consumen
`this.pages.carrito` y nunca ejecutan `new CartPage(...)`: no hay construcción
dispersa ni riesgo de instanciar una página sobre un contexto equivocado.

### 3.3 Custom World (aislamiento por escenario)

Cada escenario recibe su propio `browser`, `context` y `page` mediante los hooks
`Before`/`After`. Esto garantiza que **ningún escenario herede sesión ni
carrito** de otro, que es la causa clásica de falsos positivos en Sauce Demo
(el carrito persiste en `localStorage`). Es también lo que habilita la
paralelización futura sin reescribir nada.

El World expone además `credencialesDe(alias)`, que resuelve usuarios contra el
data pool y falla con un mensaje explícito si el alias no existe.

### 3.4 Data-Driven Testing

- **Externalización:** credenciales y datos de compra viven en
  `src/data/*.json`, no en el código ni en el Gherkin.
- **Indirección por alias:** los features dicen `"standard_user"`, no
  `"standard_user"/"secret_sauce"`. Cambiar una contraseña es editar un JSON.
- **Scenario Outline:** las combinaciones inválidas de login (5 casos) y las
  validaciones del formulario de compra (3 casos) se expresan como tablas de
  ejemplos, no como escenarios duplicados.

### 3.5 Tagging como estrategia de ejecución

`@smoke`, `@positivo`, `@negativo`, `@login`, `@carrito`, `@compra` y `@CA0x`.
Permiten una pirámide de ejecución: `@smoke` en cada commit (camino feliz de
cada criterio de aceptación), la suite completa en el pipeline nocturno. Las
etiquetas `@CA0x` trazan cada escenario contra el criterio de aceptación del
reto.

---

## 4. Estrategia de localización de elementos

Prioridad aplicada:

1. **IDs estables** — `#user-name`, `#login-button`, `#checkout`, `#finish`.
2. **Atributos de testing** — `[data-test="error"]`.
3. **Clases semánticas del dominio** — `.inventory_item`, `.cart_item`.
4. **Filtrado por contenido** — para localizar un producto por su nombre se
   filtra el contenedor, no se construye un selector dinámico frágil:

   ```js
   tarjetaDe(nombre) {
     return this.productos.filter({ has: this.page.getByText(nombre, { exact: true }) });
   }
   ```

   Esto evita depender de `add-to-cart-sauce-labs-backpack`, que acopla el test
   al slug generado por el front.

**Descartado deliberadamente:** índices posicionales (`.nth(0)`) y XPath
absolutos. Ambos rompen ante cualquier reordenamiento del catálogo.

---

## 5. Estrategia de esperas

Cero `waitForTimeout` / `sleep` en toda la suite. Se usa exclusivamente el
auto-waiting de Playwright (`waitFor({ state: 'visible' })`) con timeouts
configurables por entorno. El resultado son 22 escenarios en ~25 s sin
flakiness.

---

## 6. Evidencias y diagnóstico

- Captura de pantalla automática de todo escenario fallido, adjunta al reporte
  HTML y persistida en `reports/evidencias/`.
- Se adjunta también la URL final: el 80 % de los fallos en E2E son
  "la navegación no llegó a donde se creía", y el dato lo resuelve al instante.
- Aserciones con mensaje explícito. En vez de `expected 2 to equal 1`, la suite
  reporta:

  ```
  "Sauce Labs Backpack" no está en el carrito. Contenido actual: Sauce Labs Bike Light
  ```

---

## 7. Gherkin: criterios de redacción

- **Idioma español** (`# language: es`) — la especificación es legible por QA
  funcional y negocio, que es el punto de usar BDD.
- **Declarativo, no imperativo.** Se escribe `Cuando el usuario inicia sesión
  como "standard_user"`, no `Cuando escribe "standard_user" en el campo #user-name`.
  El Gherkin describe *qué* hace el usuario; el *cómo* vive en el Page Object.
- **Steps reutilizables.** `se muestra el mensaje de error {string}` se comparte
  entre login y checkout: una definición, dos características.
- **`Antecedentes`** para las precondiciones repetidas (estar autenticado),
  evitando ruido en cada escenario.

---

## 8. Validaciones más allá de lo pedido

El reto pide llegar a la confirmación de compra. La suite además verifica:

- Que el **total = subtotal + impuesto** en el resumen de la orden (regla de
  negocio real, no sólo presencia de elementos).
- Que el **carrito queda vacío** después de finalizar la compra.
- Que el producto agregado cambia su botón a `Remove` (feedback visual).
- Que el carrito **inicia vacío** en una sesión nueva (verifica el aislamiento
  entre escenarios).
- Que el **cierre de sesión** devuelve al login.

Criterio aplicado: un `toBeVisible` no valida comportamiento. Cuando el
criterio de aceptación dice "ver los productos agregados", se comparan las
listas completas, no la mera existencia de la tabla.

---

## 9. Decisiones y compromisos

| Decisión | Razón |
|---|---|
| Un navegador por escenario en vez de reusarlo | Prioriza aislamiento sobre velocidad; con 22 escenarios el costo es ~25 s, aceptable |
| `parallel: 0` (secuencial) por defecto | El World ya es thread-safe; se deja en secuencial para que el log sea legible en la evaluación. Subir a `parallel: 4` no requiere cambios de código |
| `node:assert` en vez de `expect` de Playwright | El paquete `@playwright/test` trae su propio runner, que competiría con Cucumber |
| Sin `dotenv` | La configuración por entorno se resuelve con variables de entorno nativas; una dependencia menos |

---

## 10. Siguientes pasos naturales

1. Ejecución en paralelo (`parallel: 4`) — la arquitectura ya lo soporta.
2. Matriz de navegadores en CI (chromium / firefox / webkit) vía `BROWSER`.
3. Cobertura de `problem_user` y `performance_glitch_user`, ya presentes en el
   data pool.
4. Trace viewer de Playwright en los fallos, para depuración paso a paso.
