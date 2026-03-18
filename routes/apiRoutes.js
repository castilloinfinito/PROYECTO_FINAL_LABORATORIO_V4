const express = require('express');
const router = express.Router();
const C = require('../controllers/GeneralController');

// Middleware de Seguridad por Roles
const auth = (rolesPermitidos) => (req, res, next) => {
  if (req.user && rolesPermitidos.includes(req.user.rol)) return next();
  res.status(403).json({ success: false, error: "No tienes permisos para esta sección." });
};

// RUTAS AUTOMATIZADAS POR ENTIDAD
const configurarRutas = (path, ctrl, rolesLectura, rolesEscritura) => {
  router.get(`/${path}`, auth(rolesLectura), ctrl.listar);
  router.post(`/${path}`, auth(rolesEscritura), ctrl.crear);
  router.put(`/${path}/:id`, auth(['Admin']), ctrl.actualizar); // Solo admin edita/borra por defecto
  router.delete(`/${path}/:id`, auth(['Admin']), ctrl.eliminar);
};

// Configuración de permisos
configurarRutas('pacientes', C.PacienteCtrl, ['Admin', 'Recepcion', 'Bioanalista', 'Contador'], ['Admin', 'Recepcion']);
configurarRutas('medicos', C.MedicoCtrl, ['Admin', 'Recepcion'], ['Admin']);
configurarRutas('examenes', C.ExamenCtrl, ['Admin', 'Bioanalista', 'Recepcion'], ['Admin']);
configurarRutas('resultados', C.ResultadoCtrl, ['Admin', 'Bioanalista'], ['Admin', 'Bioanalista']);
configurarRutas('insumos', C.InsumoCtrl, ['Admin', 'Bioanalista'], ['Admin', 'Bioanalista']);
configurarRutas('citas', C.CitaCtrl, ['Admin', 'Recepcion'], ['Admin', 'Recepcion']);
configurarRutas('facturas', C.FacturaCtrl, ['Admin', 'Contador'], ['Admin', 'Contador']);
configurarRutas('equipos', C.EquipoCtrl, ['Admin', 'Bioanalista'], ['Admin']);
configurarRutas('usuarios', C.UsuarioCtrl, ['Admin'], ['Admin']);

module.exports = router;