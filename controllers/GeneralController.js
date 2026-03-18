const models = require('../models/LaboratorioModels');

class GenericController {
  constructor(model) { this.model = model; }

  listar = async (req, res) => {
    try {
      let query = this.model.find();
      if (this.model.modelName === 'Usuario') query = query.select('-password');
      
      const paths = Object.keys(this.model.schema.paths);
      if (paths.includes('pacienteId')) query = query.populate('pacienteId', 'nombre');
      if (paths.includes('medicoId')) query = query.populate('medicoId', 'nombre');
      
      const data = await query.sort({ createdAt: -1 }).lean();
      res.json(data);
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
  }

  crear = async (req, res) => {
    try {
      const nuevo = await this.model.create(req.body);
      res.status(201).json({ success: true, data: nuevo });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  }

  actualizar = async (req, res) => {
    try {
      const editado = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!editado) return res.status(404).json({ error: "No encontrado" });
      res.json({ success: true, data: editado });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  }

  eliminar = async (req, res) => {
    try {
      const borrado = await this.model.findByIdAndDelete(req.params.id);
      if (!borrado) return res.status(404).json({ error: "No encontrado" });
      res.json({ success: true, mensaje: "Eliminado" });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
  }
}

const controllers = {};
Object.keys(models).forEach(key => {
  controllers[`${key}Ctrl`] = new GenericController(models[key]);
});

module.exports = controllers;