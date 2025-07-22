// ---- Variables globales
let cuenta = null;
let operacionActual = "";

// ---- Elementos del DOM
const loginForm = document.getElementById("loginForm");
const usuarioInput = document.getElementById("usuario");
const claveInput = document.getElementById("clave");
const loginSection = document.getElementById("loginSection");
const cajeroSection = document.getElementById("cajeroSection");
const nombreUsuario = document.getElementById("nombreUsuario");
const consultarSaldoBtn = document.getElementById("consultarSaldo");
const depositarBtn = document.getElementById("depositar");
const retirarBtn = document.getElementById("retirar");
const verMovimientosBtn = document.getElementById("verMovimientos");
const borrarMovimientosBtn = document.getElementById("borrarMovimientos");
const cerrarSesionBtn = document.getElementById("cerrarSesion");
const resultado = document.getElementById("resultado");
const operacionForm = document.getElementById("operacionForm");
const montoInput = document.getElementById("monto");
const confirmarOperacionBtn = document.getElementById("confirmarOperacion");

// ---- Funciones de interfaz
function mostrarMensajealert(mensaje, icono = "info") {
    Swal.fire({
        icon: icono,
        text: mensaje,
        showConfirmButton: false,
        timer: 3000
    });
}

function mostrarMensajeresultado(mensaje) {
    resultado.textContent = mensaje;
}

function mostrarPanelCajero() {
    loginSection.style.display = "none";
    cajeroSection.style.display = "block";
    nombreUsuario.textContent = cuenta.nombre;
    mostrarMensajeresultado("Selecciona una operación.");
}

// ---- Carga de usuarios en BD
let listaUsuarios = [];

function cargarUsuarios() {
    const usuariosLocales = localStorage.getItem("usuarios");
    if (usuariosLocales) {
        listaUsuarios = JSON.parse(usuariosLocales);
    } else {
        fetch("data/usuarios.json")
            .then(res => res.json())
            .then(data => {
                listaUsuarios = data;
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Error de conexión",
                    text: "No fue posible cargar los usuarios. Intenta más tarde.",
                });
            });
    }
}
cargarUsuarios();

// ---- Crear usuario
function crearUsuario(nombre, clave) {
    const nuevoUsuario = { usuario: nombre, clave };
    listaUsuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
    cuenta = new Cuenta(nombre, 0);
    guardarEnStorage();
}

// ---- Eventos

// Login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = usuarioInput.value.trim();
    const clave = claveInput.value;

    if (nombre && clave) {
        const usuarioValido = listaUsuarios.find(
            u => u.usuario === nombre && u.clave === clave
        );

        if (usuarioValido) {
            localStorage.setItem("logueado", nombre);
            cuenta = cargarDesdeStorage() || new Cuenta(nombre, 0);
            guardarEnStorage();
            mostrarPanelCajero();
        } else {
            Swal.fire({
                title: "Credenciales no encontradas",
                text: "¿Deseas crear una cuenta nueva?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Crear cuenta",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    const yaExiste = listaUsuarios.some(u => u.usuario === nombre);
                    if (yaExiste) {
                        mostrarMensajealert("Ese nombre de usuario ya está en uso.", "error");
                    } else {
                        crearUsuario(nombre, clave);
                        localStorage.setItem("logueado", nombre);
                        mostrarPanelCajero();
                        Swal.fire("Cuenta creada", "Tu cuenta fue registrada exitosamente", "success");
                    }
                }
            });
        }
    }
});

// Consultar saldo
consultarSaldoBtn.addEventListener("click", () => {
    mostrarMensajeresultado(`Tu saldo actual es $${cuenta.saldo}`);
    operacionForm.style.display = "none";
});

// Depositar
depositarBtn.addEventListener("click", () => {
    operacionActual = "deposito";
    operacionForm.style.display = "block";
    mostrarMensajeresultado("Ingrese el monto a depositar:");
});

// Retirar
retirarBtn.addEventListener("click", () => {
    operacionActual = "retiro";
    operacionForm.style.display = "block";
    mostrarMensajeresultado("Ingrese el monto a retirar:");
});

// Ver movimientos
verMovimientosBtn.addEventListener("click", () => {
    if (cuenta.movimientos.length === 0) {
        mostrarMensajeresultado("Selecciona una operación.");
        mostrarMensajealert("No hay movimientos registrados.", "info");
        operacionForm.style.display = "none";
    } else {
        let lista = "";
        cuenta.movimientos.forEach(movimiento => {
            lista += `${movimiento.fecha} - ${movimiento.tipo}: $${movimiento.monto}\n`;
        });
        mostrarMensajeresultado(lista);
        operacionForm.style.display = "none";
    }
});

// Borrar movimientos
borrarMovimientosBtn.addEventListener("click", () => {
    cuenta.movimientos = [];
    guardarEnStorage();
    mostrarMensajeresultado("Selecciona una operación."); 
    mostrarMensajealert("Historial de movimientos eliminado.", "success");
    operacionForm.style.display = "none";
});

// Confirmar operación
operacionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    mostrarMensajeresultado("Selecciona una operación."); 
    const monto = parseFloat(montoInput.value);
    if (isNaN(monto) || monto <= 0) {
        mostrarMensajealert("Ingresa un monto válido.", "error");
        return;
    }
    if (operacionActual === "deposito") {
        cuenta.depositar(monto);
        mostrarMensajealert(`Depósito de $${monto} exitoso. Saldo actual: $${cuenta.saldo}`, "success");
    } else if (operacionActual === "retiro") {
        const exito = cuenta.retirar(monto);
        if (exito) {
            mostrarMensajealert(`Retiro de $${monto} exitoso. Saldo actual: $${cuenta.saldo}`, "success");
        } else {
            mostrarMensajealert("Fondos insuficientes.", "error");
        }
    }
    guardarEnStorage();
    operacionForm.reset();
    operacionForm.style.display = "none";
});

// Cerrar sesión
cerrarSesionBtn.addEventListener("click", () => {
    localStorage.removeItem("logueado");
    cuenta = null;
    loginForm.reset();
    loginSection.style.display = "block";
    cajeroSection.style.display = "none";
    resultado.textContent = "";
    operacionForm.reset();
    operacionForm.style.display = "none";
    mostrarMensajealert(`Sesión cerrada con exito.`, "success");
});

// Cargar usuario si estaba logueado
cuenta = cargarDesdeStorage();
if (cuenta) {
    mostrarPanelCajero();
}