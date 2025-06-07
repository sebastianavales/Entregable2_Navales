// Variables iniciales
let saldo = 1000;
const usuario = "usuario";
const pin = "1234";

// Función de ingreso al sistema
function iniciarSesion() {
    const inputUsuario = prompt("Ingrese su nombre de usuario:");
    const inputPin = prompt("Ingrese su PIN:");

    if (inputUsuario === usuario && inputPin === pin) {
        alert("Acceso concedido");
        mostrarMenu();
    } else {
        alert("Usuario o PIN incorrecto");
    }
}

// Función para mostrar el menú principal
function mostrarMenu() {
    let opcion;
    do {
        opcion = prompt(
            "Seleccione una opción:\n" +
            "1. Consultar saldo\n" +
            "2. Retirar dinero\n" +
            "3. Depositar dinero\n" +
            "4. Salir"
        );

        switch(opcion) {
            case "1":
                consultarSaldo();
                break;
            case "2":
                retirarDinero();
                break;
            case "3":
                depositarDinero();
                break;
            case "4":
                alert("Gracias por utilizar el cajero. ¡Hasta luego!");
                break;
            default:
                alert("Opción no válida. Intente de nuevo.");
        }

    } while(opcion !== "4");
}

// Función para consultar saldo
function consultarSaldo() {
    alert(`Su saldo actual es: $${saldo}`);
    console.log("Saldo consultado:", saldo);
}

// Función para retirar dinero
function retirarDinero() {
    let monto = parseFloat(prompt("Ingrese el monto a retirar:"));
    if (isNaN(monto) || monto <= 0) {
        alert("Monto no válido.");
    } else if (monto > saldo) {
        alert("Fondos insuficientes.");
    } else {
        saldo -= monto;
        alert(`Retiro exitoso. Nuevo saldo: $${saldo}`);
    }
}

// Función para depositar dinero
function depositarDinero() {
    let monto = parseFloat(prompt("Ingrese el monto a depositar:"));
    if (isNaN(monto) || monto <= 0) {
        alert("Monto no válido.");
    } else {
        saldo += monto;
        alert(`Depósito exitoso. Nuevo saldo: $${saldo}`);
    }
}

// Iniciar simulador
iniciarSesion();