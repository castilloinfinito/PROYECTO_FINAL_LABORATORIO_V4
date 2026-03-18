# 🧪 LabSystem Pro - Sistema de Gestión de Laboratorio (V2.0)

Este proyecto es una API REST integral y un Dashboard administrativo desarrollado con **Node.js**, **Express**, **MongoDB** y **EJS**. Está diseñado para gestionar el flujo completo de un laboratorio clínico, desde la recepción del paciente hasta la facturación y el control de inventario.

## 📂 Estructura del Proyecto

- `app.js`: Punto de entrada y configuración de middlewares globales.
- `controllers/`: Lógica de negocio genérica (Principio DRY).
- `models/`: Definición de las 10 entidades (Mongoose).
- `routes/`: Capa de seguridad por roles y rutas API.
- `scripts/`: Herramientas de migración y carga masiva (Seeders).
- `views/`: Interfaz dinámica renderizada en el servidor.

---

## 🔐 Modelo de Seguridad y Roles

El sistema implementa una doble capa de seguridad:
1.  **Frontend**: Filtrado de interfaz según el rol del usuario logueado.
2.  **Backend**: Middleware JWT que verifica permisos antes de procesar cualquier solicitud.

| Rol | Facultades Principales | Acceso a Entidades |
| :--- | :--- | :--- |
| **Admin** | Control total del sistema. | Todas (10) |
| **Recepcion** | Gestión de citas y admisión. | Pacientes, Médicos, Citas |
| **Bioanalista** | Análisis, resultados e insumos. | Resultados, Exámenes, Insumos, Equipos |
| **Contador** | Gestión de cobranza. | Facturas, Pacientes |

### Protección contra Fuerza Bruta
El login cuenta con un contador de **5 intentos máximos**. Tras superar el límite, la interfaz se bloquea localmente para prevenir ataques automatizados.

---

