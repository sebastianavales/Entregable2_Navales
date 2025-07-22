# 📄 Proyecto Final - Simulador de Cajero Automático

**Autor:** Sebastián Navales Parra  
**Curso:** JavaScript - Coderhouse  
**Entrega:** Proyecto Final

---

## 🧩 Descripción general

Este proyecto simula el funcionamiento básico de un cajero automático desde el navegador, permitiendo:

- Registro de nuevos usuarios con contraseña  
- Inicio de sesión con validación  
- Visualización de saldo  
- Depósitos y retiros  
- Historial de movimientos  
- Persistencia de datos mediante `localStorage`

---

## 🚀 ¿Cómo usarlo?

1. Accede al simulador desde el sitio desplegado en **GitHub Pages**

2. En la pantalla de inicio:

   - Si ya tienes una cuenta, **ingresa tu usuario y contraseña** y haz clic en **"Iniciar sesión"**.  
     > Nota: Hay dos usuarios simulados en base de datos, en el archivo `usuarios.json` ubicado en la carpeta `data`.

   - Si eres nuevo, **ingresa un usuario y contraseña** y se te dará la opción de crear la cuenta.  
     - Se creará con un saldo inicial de `$0.00`.  
     - **No se permite reutilizar nombres de usuario ya registrados.**

3. Una vez dentro podrás:

   - Consultar tu saldo  
   - Realizar depósitos y retiros  
   - Ver el historial de movimientos  
   - Borrar los movimientos  
   - Cerrar sesión

> Toda la información se guarda en `localStorage` del navegador, lo que permite mantener los datos incluso si se recarga la página o se cierra el navegador.

---

## 🔐 Información clave sobre usuarios

- Cada usuario debe tener un **nombre único**.  
- Si el nombre ya existe, solo se podrá acceder ingresando la **contraseña correcta**.  
- Actualmente **no es posible modificar la contraseña desde la interfaz**.

---

## 📁 Estructura del proyecto

ProyectoFinalNavales/
│
├── index.html
├── css/
│ └── styles.css
├── data/
│ └── usuarios.json
├── js/
│ ├── clases.js
│ └── main.js
└── README.md

---

¡Gracias por revisar el proyecto!