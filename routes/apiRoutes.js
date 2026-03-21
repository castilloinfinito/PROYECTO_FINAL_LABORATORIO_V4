// importacion de modulos de express
const express = require('express');
const router = express.Router();
const C = require('../controllers/GeneralController');
const { verificarAcceso } = require('../middlewares/authMiddleware');

/**
 * Función automatizada para configurar rutas CRUD.
 * @param {string} path - Nombre del endpoint (ej: 'pacientes')
 * @param {object} ctrl - Instancia del controlador
 * @param {array} rolesLectura - Quiénes pueden ver
 * @param {array} rolesEscritura - Quiénes pueden crear/editar
 */
const configurarRutas = (path, ctrl, rolesLectura, rolesEscritura) => {
  // GET: Listar (Cualquiera con rol permitido)
  router.get(`/${path}`, verificarAcceso(rolesLectura), ctrl.listar);
  
  // POST: Crear
  router.post(`/${path}`, verificarAcceso(rolesEscritura), ctrl.crear);
  
  // PUT/DELETE: Solo Admin ( seguridad por defecto)
  router.put(`/${path}/:id`, verificarAcceso(['Admin']), ctrl.actualizar);
  router.delete(`/${path}/:id`, verificarAcceso(['Admin']), ctrl.eliminar);
};

// --- DEFINICIÓN DE ACCESOS POR MÓDULO ---

// Pacientes: Recepción y Admin gestionan, otros solo ven.
configurarRutas('pacientes', C.PacienteCtrl, ['Admin', 'Recepcion', 'Bioanalista', 'Contador'], ['Admin', 'Recepcion']);

// Médicos: Solo Admin gestiona.
configurarRutas('medicos', C.MedicoCtrl, ['Admin', 'Recepcion'], ['Admin']);

// Exámenes: Bioanalista y Admin gestionan.
configurarRutas('examenes', C.ExamenCtrl, ['Admin', 'Bioanalista', 'Recepcion'], ['Admin', 'Bioanalista']);

// Resultados: SOLO Bioanalistas y Admin. Recepción NO puede entrar aquí.
configurarRutas('resultados', C.ResultadoCtrl, ['Admin', 'Bioanalista'], ['Admin', 'Bioanalista']);

// Insumos y Equipos: Bioanalistas y Admin.
configurarRutas('insumos', C.InsumoCtrl, ['Admin', 'Bioanalista'], ['Admin', 'Bioanalista']);
configurarRutas('equipos', C.EquipoCtrl, ['Admin', 'Bioanalista'], ['Admin', 'Bioanalista']);

// Citas y Facturas: Recepción y Contador.
configurarRutas('citas', C.CitaCtrl, ['Admin', 'Recepcion'], ['Admin', 'Recepcion']);
configurarRutas('facturas', C.FacturaCtrl, ['Admin', 'Contador', 'Recepcion'], ['Admin', 'Contador']);

module.exports = router;