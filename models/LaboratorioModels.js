// importacion de modelos de express
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ESQUEMA DE USUARIO(seguridad de login)
const UsuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['Admin', 'Recepcion', 'Bioanalista', 'Contador'], default: 'Recepcion' },
  cargo: { type: String }
}, { timestamps: true });

UsuarioSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UsuarioSchema.methods.compararPassword = async function(passwordCandidata) {
  return await bcrypt.compare(passwordCandidata, this.password);
};

// ENTIDADES ORIGINALES
const PacienteSchema = new mongoose.Schema({ nombre: String, ci: { type: String, unique: true }, telefono: String }, { timestamps: true });
const MedicoSchema = new mongoose.Schema({ nombre: String, especialidad: String, mpps: String }, { timestamps: true });
const ExamenSchema = new mongoose.Schema({ nombre: String, precio: Number, numeroOrden: String, medicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' } }, { timestamps: true });
const ResultadoSchema = new mongoose.Schema({ numeroOrden: String, pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' }, medicoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' }, valor: String, fecha: { type: Date, default: Date.now } }, { timestamps: true });

// 4 NUEVAS ENTIDADES ADICIONALES, complementos agministrativos del laboratorio.
const InsumoSchema = new mongoose.Schema({ nombre: String, stock: Number, unidad: { type: String, enum: ['Unidades', 'ML', 'Cajas'] }, fechaVencimiento: Date }, { timestamps: true });
const CitaSchema = new mongoose.Schema({ pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' }, fecha: Date, motivo: String, estado: { type: String, enum: ['Pendiente', 'Completada', 'Cancelada'], default: 'Pendiente' } }, { timestamps: true });
const FacturaSchema = new mongoose.Schema({ pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' }, montoTotal: Number, metodoPago: { type: String, enum: ['Efectivo', 'Transferencia', 'Zelle'] }, pagado: { type: Boolean, default: false } }, { timestamps: true });
const EquipoSchema = new mongoose.Schema({ nombre: String, marca: String, ultimoMantenimiento: Date, estado: { type: String, enum: ['Operativo', 'En Reparacion', 'Fuera de Servicio'] } }, { timestamps: true });

module.exports = {
  Usuario: mongoose.model('Usuario', UsuarioSchema),
  Paciente: mongoose.model('Paciente', PacienteSchema),
  Medico: mongoose.model('Medico', MedicoSchema),
  Examen: mongoose.model('Examen', ExamenSchema),
  Resultado: mongoose.model('Resultado', ResultadoSchema),
  Insumo: mongoose.model('Insumo', InsumoSchema),
  Cita: mongoose.model('Cita', CitaSchema),
  Factura: mongoose.model('Factura', FacturaSchema),
  Equipo: mongoose.model('Equipo', EquipoSchema)
};