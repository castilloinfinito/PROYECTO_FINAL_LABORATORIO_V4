require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const conectarDB = require('./database/db');
const { Usuario } = require('./models/LaboratorioModels');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// 1. CONEXIÓN A BASE DE DATOS
conectarDB();

// 2. CONFIGURACIÓN DE MOTOR DE VISTAS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 3. MIDDLEWARES DE PROCESAMIENTO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 4. MIDDLEWARE GLOBAL DE JWT (La base de tu seguridad)
// Extrae el usuario del token en cada petición para que los controladores lo usen
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Inyecta {id, rol, username} en el request
        } catch (error) {
            console.error("JWT Error: Token expirado o inválido");
        }
    }
    next();
});

// 5. RUTA DE AUTENTICACIÓN (LOGIN)
app.post('/auth', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Usuario.findOne({ username });

        if (!user || !(await user.compararPassword(password))) {
            return res.status(401).json({ success: false, error: "Usuario o clave incorrectos" });
        }

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
        res.status(500).json({ success: false, error: "Error en el servidor de autenticación" });
    }
});

// 6. RUTAS DE LA API (Separación de Objetos y Servicios - SOS)
app.use('/api', apiRoutes);

// 7. RUTAS DE NAVEGACIÓN (FRONTEND)
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('login'));

// 8. MANEJO DE ERRORES Y 404
app.use((req, res) => {
    res.status(404).send('Recurso no encontrado en LabSystem');
});

// 9. LANZAMIENTO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    =================================================
    🧪 LAB-SYSTEM V4.0 - LOGICA SOS ACTIVADA
    📡 Servidor: http://localhost:${PORT}
    🔐 Seguridad: JWT + Roles (Admin/Bio/Rec/Cont)
    =================================================
    `);
});