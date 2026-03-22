# 🔬 LabSystem Pro - Gestión de Laboratorio Clínico

Sitema integral para la automatización de procesos en laboratorios clínicos, desarrollado bajo una arquitectura robusta de Microservicios API REST y vistas dinámicas en EJS.

## 🚀 Características Principales
- **Arquitectura Centralizada:** Uso de un `GenericController` para operaciones CRUD dinámicas.
- **Seguridad Avanzada:** Autenticación mediante **JSON Web Tokens (JWT)** y encriptación de contraseñas con **Bcrypt**.
- **Control de Acceso (RBAC):** Restricción de funciones basada en roles (Admin, Bioanalista, Recepción, Contador).
- **Interfaz SPA:** Panel de control único desarrollado en **EJS y Bootstrap 5** que consume la API de forma asíncrona.
- **Integridad Referencial:** Sistema de "Auto-Populate" dinámico para relaciones entre Entidades.

---

## 🛠️ Entidades del Sistema
El sistema gestiona 9 entidades clave totalmente relacionadas con el entorno clínico:
1. **Pacientes:** Registro y datos demográficos.
2. **Médicos:** Gestión de especialistas remitentes.
3. **Exámenes:** Catálogo de pruebas disponibles.
4. **Resultados:** Carga y validación técnica de pruebas médicas.
5. **Citas:** Agenda y control de turnos.
6. **Insumos:** Control de inventario de reactivos y materiales.
7. **Equipos:** Registro de maquinaria médica y mantenimiento.
8. **Facturación:** Gestión de pagos y transacciones.
9. **Usuarios:** Control de personal y permisos de acceso.

---

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js (v16 o superior)
- MongoDB (Local o Atlas)

### Pasos para el Despliegue
1. **Clonar el repositorio:**
   ```bash
   git clone [ENLACE_DEL_REPOSITORIO]
   cd lab-system.