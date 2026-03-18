require('dotenv').config();
const mongoose = require('mongoose');
const { Paciente, Insumo, Cita, Factura, Equipo } = require('../models/LaboratorioModels');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/laboratorio_pro');
  
  const pacientes = await Paciente.find();
  if (pacientes.length === 0) {
    console.log("❌ Error: Crea al menos un paciente antes de ejecutar el seed.");
    process.exit();
  }

  const total = 68;

  // Insumos
  await Insumo.deleteMany({});
  const insumosArr = Array.from({ length: total }).map((_, i) => ({
    nombre: `Reactivo ${i + 1}`,
    stock: Math.floor(Math.random() * 50), // Algunos saldrán < 10 para probar alertas
    unidad: 'ML',
    fechaVencimiento: new Date(2027, 0, 1)
  }));
  await Insumo.insertMany(insumosArr);

  // Equipos
  await Equipo.deleteMany({});
  const equiposArr = Array.from({ length: total }).map((_, i) => ({
    nombre: `Analizador ${i + 1}`,
    marca: 'LabTech',
    estado: 'Operativo'
  }));
  await Equipo.insertMany(equiposArr);

  // Citas y Facturas
  await Cita.deleteMany({});
  await Factura.deleteMany({});
  for (let i = 0; i < total; i++) {
    const p = pacientes[i % pacientes.length];
    await Cita.create({ pacienteId: p._id, fecha: new Date(), motivo: "Chequeo", estado: "Pendiente" });
    await Factura.create({ pacienteId: p._id, montoTotal: 100, metodoPago: "Zelle", pagado: false });
  }

  console.log("✅ Carga masiva de 272 documentos completada (68 x 4 entidades).");
  process.exit();
};

seed();