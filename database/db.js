const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/laboratorio_pro');
    console.log("✅ Conexión a MongoDB exitosa");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    process.exit(1);
  }
};

module.exports = conectarDB;