# language: es
@login
Característica: Inicio de sesión en Sauce Demo
  Como cliente de Sauce Demo
  Quiero poder iniciar sesión con mis credenciales
  Para acceder al catálogo de productos y realizar compras

  Antecedentes:
    Dado que el usuario está en la página de inicio de sesión

  @smoke @positivo @CA01
  Escenario: Inicio de sesión exitoso con credenciales válidas
    Cuando el usuario inicia sesión como "standard_user"
    Entonces el usuario visualiza la página de productos
    Y el título de la sección es "Products"
    Y el catálogo muestra 6 productos

  @negativo @CA02
  Escenario: El usuario bloqueado no puede iniciar sesión
    Cuando el usuario inicia sesión como "locked_out_user"
    Entonces se muestra el mensaje de error "Epic sadface: Sorry, this user has been locked out."
    Y el usuario permanece en la página de inicio de sesión

  @negativo @CA02
  Esquema del escenario: Inicio de sesión con credenciales inválidas
    Cuando el usuario ingresa el usuario "<usuario>" y la contraseña "<password>"
    Y presiona el botón de inicio de sesión
    Entonces se muestra el mensaje de error "<mensaje>"
    Y el usuario permanece en la página de inicio de sesión

    Ejemplos:
      | caso                  | usuario             | password         | mensaje                                                                   |
      | password incorrecto   | standard_user       | password_erroneo | Epic sadface: Username and password do not match any user in this service |
      | usuario inexistente   | usuario_fantasma    | secret_sauce     | Epic sadface: Username and password do not match any user in this service |
      | usuario vacío         |                     | secret_sauce     | Epic sadface: Username is required                                        |
      | password vacío        | standard_user       |                  | Epic sadface: Password is required                                        |
      | ambos vacíos          |                     |                  | Epic sadface: Username is required                                        |

  @positivo
  Escenario: Cierre de sesión desde el catálogo
    Cuando el usuario inicia sesión como "standard_user"
    Y el usuario cierra sesión
    Entonces el usuario permanece en la página de inicio de sesión
