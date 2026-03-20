const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    // Usamos la variable del .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`🚀 MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    // Si la base de datos falla, la API no debe arrancar
    process.exit(1);
  }
};

// Monitoreo de desconexiones accidentales
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB se ha desconectado.');
});

module.exports = conectarDB;