const models = require('../models/LaboratorioModels');

class GenericController {
    constructor(model) {
        this.model = model;
    }

    // Listar: Mantiene tu lógica de seguridad y auto-populate
    listar = async (req, res) => {
        try {
            let query = this.model.find();
            if (this.model.modelName === 'Usuario') query = query.select('-password');
            
            // Auto-Populate inteligente para referencias
            const paths = Object.keys(this.model.schema.paths);
            paths.forEach(p => {
                if ((p.endsWith('Id') && p !== '_id') || ['paciente', 'medico'].includes(p)) {
                    query = query.populate(p, 'nombre');
                }
            });

            const data = await query.sort({ createdAt: -1 }).lean();
            res.json(data);
        } catch (e) {
            res.status(500).json({ success: false, error: e.message });
        }
    }

    // Nuevo: Necesario para que el index.ejs cargue datos al editar
    obtenerUno = async (req, res) => {
        try {
            const dato = await this.model.findById(req.params.id);
            res.json(dato);
        } catch (e) {
            res.status(404).json({ success: false, error: "No encontrado" });
        }
    }

    crear = async (req, res) => {
        try {
            const nuevo = await this.model.create(req.body);
            res.status(201).json({ success: true, data: nuevo });
        } catch (e) {
            res.status(400).json({ success: false, error: e.message });
        }
    }

    actualizar = async (req, res) => {
        try {
            const editado = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json({ success: true, data: editado });
        } catch (e) {
            res.status(400).json({ success: false, error: e.message });
        }
    }

    eliminar = async (req, res) => {
        try {
            await this.model.findByIdAndDelete(req.params.id);
            res.json({ success: true, mensaje: "Eliminado" });
        } catch (e) {
            res.status(500).json({ success: false, error: e.message });
        }
    }
}

// Exportación limpia: Cada modelo tiene su instancia de clase
module.exports = {
    Paciente: new GenericController(models.Paciente),
    Medico: new GenericController(models.Medico),
    Examen: new GenericController(models.Examen),
    Resultado: new GenericController(models.Resultado),
    Usuario: new GenericController(models.Usuario),
    Insumo: new GenericController(models.Insumo),
    Cita: new GenericController(models.Cita),
    Factura: new GenericController(models.Factura)
};