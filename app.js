require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const conectarDB = require('./database/db');
const { Usuario } = require('./models/LaboratorioModels');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'lab_secret_2026';

// Conectar a MongoDB
conectarDB();

// Configuración de Vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- RUTAS DE AUTENTICACIÓN ---
app.post('/auth', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Usuario.findOne({ username });

    if (!user || !(await user.compararPassword(password))) {
      return res.status(401).json({ success: false, error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user._id, rol: user.rol, username: user.username },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ success: true, token, user: { username: user.username, rol: user.rol } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error en el servidor" });
  }
});

// --- MIDDLEWARE PARA VALIDAR JWT EN API ---
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
};

// Rutas
app.use('/api', verificarToken, apiRoutes);
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));