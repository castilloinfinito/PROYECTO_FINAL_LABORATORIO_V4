// migrate.js revisado y potenciado
require('dotenv').config();
const mongoose = require('mongoose');
const { Usuario, Paciente, Insumo, Equipo, Medico, Examen } = require('./models/LaboratorioModels');

async function executeMigration() {
  try {
    console.log("🚀 Iniciando proceso de migración unificado...");
    await mongoose.connect(process.env.MONGO_URI);
    
    // TAREA 1: Limpieza de seguridad (Lo que hacía fix.js)
    // Útil en desarrollo para evitar duplicados de índices antiguos
    console.log("🧹 Limpiando índices de usuario...");
    await Usuario.collection.dropIndexes().catch(() => {}); 

    // TAREA 2: Garantía de Acceso Admin (Lo que hacía fix.js y migrate original)
    const adminExist = await Usuario.findOne({ rol: 'Admin' });
    if (!adminExist) {
      await Usuario.create({
        username: 'admin',
        password: '123', // Bcrypt lo encriptará automáticamente por el modelo
        rol: 'Admin',
        cargo: 'Administrador de Sistema'
      });
      console.log("✅ Usuario administrador 'admin/123' creado con éxito.");
    }

    // TAREA 3: Población de datos iniciales (Lo que hacía seed.js / seedData.js)
    // Solo insertamos si la base de datos está vacía para no duplicar
    const cuentaPacientes = await Paciente.countDocuments();
    if (cuentaPacientes === 0) {
      console.log("📦 Poblando datos iniciales de prueba...");
      // Aquí pegas una muestra representativa de tus seeds
      await Paciente.create({ nombre: "Juan Perez", ci: "V-123456", telefono: "0414-111" });
      await Insumo.create({ nombre: "Reactivo AB", stock: 5, unidad: "ML" });
      console.log("✅ Datos de prueba insertados.");
    }

    console.log("✨ Migración completada correctamente.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en la migración:", error);
    process.exit(1);
  }
}

executeMigration();