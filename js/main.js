// ---- Definición de variables globales
let cuenta = null;
let operacionActual = "";

// ---- Definición de elementos DOM
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
const cerrarSesionBtn = document.getElementById("cerrarSesion");
const resultado = document.getElementById("resultado");
const operacionForm = document.getElementById("operacionForm");
const montoInput = document.getElementById("monto");
const confirmarOperacionBtn = document.getElementById("confirmarOperacion");

// ---- Función constructora de cuenta
function Cuenta(nombre, saldoInicial) {
    this.nombre = nombre;
    this.saldo = saldoInicial;
    this.movimientos = [];

    this.depositar = function(monto) {
        this.saldo += monto;
        this.movimientos.push({tipo: "Depósito", monto, fecha: new Date().toLocaleString()});
    };

    this.retirar = function(monto) {
        if (monto <= this.saldo) {
            this.saldo -= monto;
            this.movimientos.push({tipo: "Retiro", monto, fecha: new Date().toLocaleString()});
            return true;
        }
        else {
            return false;
        }   
    };
}

// ---- Otras funciones auxiliares
function mostrarMensaje(mensaje) {
    resultado.textContent = mensaje;
}

function mostrarPanelCajero() {
    loginSection.style.display = "none";
    cajeroSection.style.display = "block";
    nombreUsuario.textContent = cuenta.nombre;
    mostrarMensaje("Selecciona una operación.");
}

function guardarEnStorage() {
    if (cuenta) {
        localStorage.setItem(cuenta.nombre, JSON.stringify(cuenta));
    }
}

function cargarDesdeStorage() {
    const usuarioLogueado = localStorage.getItem("logueado");
    if (usuarioLogueado) {
        const cuentaGuardada = localStorage.getItem(usuarioLogueado);
        if (cuentaGuardada) {
            const datos = JSON.parse(cuentaGuardada);
            cuenta = new Cuenta(datos.nombre, datos.saldo);
            cuenta.movimientos = datos.movimientos || [];
            mostrarPanelCajero();
        }
    }
}

// ---- Eventos

// Inicio de sesión
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = usuarioInput.value.trim();
    const clave = claveInput.value;
    if (nombre && clave) {
        localStorage.setItem("logueado", nombre);
        if (!localStorage.getItem(nombre)) {
        cuenta = new Cuenta(nombre, 0);
        guardarEnStorage();
        }
        cargarDesdeStorage();
    }
}
);

// Consultar saldo
consultarSaldoBtn.addEventListener("click", () => {
    mostrarMensaje(`Tu saldo actual es $${cuenta.saldo}`);
}
);

// Depositar
depositarBtn.addEventListener("click", () => {
    operacionActual = "deposito";
    operacionForm.style.display = "block";
}
);

// Retirar
retirarBtn.addEventListener("click", () => {
    operacionActual = "retiro";
    operacionForm.style.display = "block";
}
);

// Ver movimientos
verMovimientosBtn.addEventListener("click", () => {
    if (cuenta.movimientos.length === 0) {
        mostrarMensaje("No hay movimientos registrados.");
    } 
    else {
        const lista = cuenta.movimientos
        .map(m => `${m.fecha} - ${m.tipo}: $${m.monto}`)
        .join("<br>");
        resultado.innerHTML = lista;
    }
}
);

// Confirmar operación (retiro o depósito)
operacionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const monto = parseFloat(montoInput.value);
    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje("Ingresa un monto válido.");
        return;
    }
    if (operacionActual === "deposito") {
        cuenta.depositar(monto);
        mostrarMensaje(`Depósito de $${monto} exitoso. Saldo actual: $${cuenta.saldo}`);
    } 
    else if (operacionActual === "retiro") {
        const exito = cuenta.retirar(monto);
        if (exito) {
        mostrarMensaje(`Retiro de $${monto} exitoso. Saldo actual: $${cuenta.saldo}`);
        } 
        else {
        mostrarMensaje("Fondos insuficientes.");
        }
    }
    guardarEnStorage();
    operacionForm.reset();
    operacionForm.style.display = "none";
}
);

// Cerrar sesión
cerrarSesionBtn.addEventListener("click", () => {
    localStorage.removeItem("logueado");
    cuenta = null;
    loginForm.reset();
    loginSection.style.display = "block";
    cajeroSection.style.display = "none";
    resultado.textContent = "";
});

// Evitar cerrar sesión de forma automatica
cargarDesdeStorage();