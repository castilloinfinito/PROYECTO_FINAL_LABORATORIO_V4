const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/generalController');

// Middleware de Roles
const verificarAcceso = (rolesPermitidos) => (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ error: "No autorizado" });
    }
    next();
};

// 1. MAPEO CRUCIAL: Vincula la URL con el objeto del controlador exacto
const entidaMap = {
    'pacientes': ctrl.Paciente,
    'medicos':   ctrl.Medico,
    'examenes':  ctrl.Examen,
    'resultados':ctrl.Resultado,
    'usuarios':  ctrl.Usuario,
    'insumos':   ctrl.Insumo,
    'citas':     ctrl.Cita,
    'facturas':  ctrl.Factura
};

const permisos = {
    pacientes: ['Admin', 'Recepcion', 'Bioanalista'],
    examenes:  ['Admin', 'Bioanalista'],
    resultados:['Admin', 'Bioanalista'],
    facturas:  ['Admin', 'Contador'],
    insumos:   ['Admin', 'Contador'],
    usuarios:  ['Admin'],
    medicos:   ['Admin'],
    citas:     ['Admin', 'Recepcion']
};

// Helper para obtener el controlador sin errores de dedo
const getCtrl = (entity) => entidaMap[entity];

// RUTA DINÁMICA CORREGIDA
router.route('/:entity')
    .all((req, res, next) => {
        if (!getCtrl(req.params.entity)) return res.status(404).json({error: "Entidad no válida"});
        verificarAcceso(permisos[req.params.entity] || [])(req, res, next);
    })
    .get((req, res) => getCtrl(req.params.entity).listar(req, res))
    .post((req, res) => getCtrl(req.params.entity).crear(req, res));

router.route('/:entity/:id')
    .all((req, res, next) => {
        if (!getCtrl(req.params.entity)) return res.status(404).json({error: "Entidad no válida"});
        next();
    })
    .get((req, res) => getCtrl(req.params.entity).obtenerUno(req, res))
    .put((req, res) => getCtrl(req.params.entity).actualizar(req, res))
    .delete((req, res) => getCtrl(req.params.entity).eliminar(req, res));

module.exports = router;