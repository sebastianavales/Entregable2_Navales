// ---- Clase Cuenta
class Cuenta {
    constructor(nombre, saldoInicial) {
        this.nombre = nombre;
        this.saldo = saldoInicial;
        this.movimientos = [];
    }

    depositar(monto) {
        this.saldo += monto;
        this.movimientos.push({
            tipo: "Depósito",
            monto,
            fecha: new Date().toLocaleString()
        });
    }

    retirar(monto) {
        if (monto <= this.saldo) {
            this.saldo -= monto;
            this.movimientos.push({
                tipo: "Retiro",
                monto,
                fecha: new Date().toLocaleString()
            });
            return true;
        }
        return false;
    }
}

// ---- Funciones auxiliares
function guardarEnStorage() {
    try {
        if (cuenta) {
            localStorage.setItem(cuenta.nombre, JSON.stringify(cuenta));
        }
    } catch (error) {
        Swal.fire("Error", "No se pudo guardar la cuenta", "error");
    }
}

function cargarDesdeStorage() {
    const usuarioLogueado = localStorage.getItem("logueado");
    if (usuarioLogueado) {
        const cuentaGuardada = localStorage.getItem(usuarioLogueado);
        if (cuentaGuardada) {
            const datos = JSON.parse(cuentaGuardada);
            const cuentaRestaurada = new Cuenta(datos.nombre, datos.saldo);
            cuentaRestaurada.movimientos = datos.movimientos || [];
            return cuentaRestaurada;
        }
    }
    return null;
}