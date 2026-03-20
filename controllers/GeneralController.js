const models = require('../models/LaboratorioModels');

class GenericController {
  constructor(model) {
    this.model = model;
  }

  // Listar con Auto-Populate dinámico
  listar = async (req, res) => {
    try {
      let query = this.model.find();
      
      // Seguridad: Si es el modelo de Usuario, nunca enviar el password
      if (this.model.modelName === 'Usuario') {
        query = query.select('-password');
      }
      
      // Auto-Populate: Busca campos que terminan en 'Id' y trae su nombre
      const paths = Object.keys(this.model.schema.paths);
      paths.forEach(path => {
        if (path.endsWith('Id') && path !== '_id') {
          query = query.populate(path, 'nombre'); 
        }
      });
      
      const data = await query.sort({ createdAt: -1 }).lean();
      res.json(data);
    } catch (e) {
      res.status(500).json({ success: false, error: "Error al obtener datos: " + e.message });
    }
  }

  crear = async (req, res) => {
    try {
      const nuevo = await this.model.create(req.body);
      res.status(201).json({ success: true, data: nuevo });
    } catch (e) {
      res.status(400).json({ success: false, error: "Error al crear registro: " + e.message });
    }
  }

  actualizar = async (req, res) => {
    try {
      const editado = await this.model.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      if (!editado) return res.status(404).json({ success: false, error: "Registro no encontrado" });
      res.json({ success: true, data: editado });
    } catch (e) {
      res.status(400).json({ success: false, error: "Error al actualizar: " + e.message });
    }
  }

  eliminar = async (req, res) => {
    try {
      const borrado = await this.model.findByIdAndDelete(req.params.id);
      if (!borrado) return res.status(404).json({ success: false, error: "No se pudo eliminar: Registro no encontrado" });
      res.json({ success: true, mensaje: "Eliminado correctamente" });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  }
}

// Exportamos las instancias para cada modelo
module.exports = {
  PacienteCtrl: new GenericController(models.Paciente),
  MedicoCtrl: new GenericController(models.Medico),
  ExamenCtrl: new GenericController(models.Examen),
  ResultadoCtrl: new GenericController(models.Resultado),
  UsuarioCtrl: new GenericController(models.Usuario),
  InsumoCtrl: new GenericController(models.Insumo),
  CitaCtrl: new GenericController(models.Cita),
  FacturaCtrl: new GenericController(models.Factura),
  EquipoCtrl: new GenericController(models.Equipo)
};