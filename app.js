require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const conectarDB = require('./database/db');
const { Usuario } = require('./models/LaboratorioModels');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// 1. Conectar a la Base de Datos
conectarDB();

// 2. Configuraciones de Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 3. Ruta de Autenticación (Login)
app.post('/auth', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Buscar usuario y ejecutar el método de comparación de password (definido en el modelo)
    const user = await Usuario.findOne({ username });
    if (!user || !(await user.compararPassword(password))) {
      return res.status(401).json({ success: false, error: "Usuario o contraseña incorrectos" });
    }

    // Generar Token JWT con la clave del .env
    const token = jwt.sign(
      { id: user._id, rol: user.rol, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      success: true, 
      token, 
      user: { username: user.username, rol: user.rol } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// 4. Integración de Rutas de la API (Toda la lógica protegida está aquí)
app.use('/api', apiRoutes);

// 5. Rutas de Frontend (Renderizado de Vistas)
app.get('/login', (req, res) => res.render('login'));
app.get('/', (req, res) => res.render('index'));

// 6. Manejo de Errores 404 (Ruta no encontrada)
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Endpoint no encontrado" });
});

// Lanzar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor LabSystem Pro corriendo en: http://localhost:${PORT}`);
});