const jwt = require('jsonwebtoken');

/**
 * Middleware unificado para proteger rutas.
 * 1. Verifica la validez del Token JWT.
 * 2. (Opcional) Verifica si el rol del usuario está permitido.
 */
const verificarAcceso = (rolesPermitidos = []) => {
    return (req, res, next) => {
        // 1. Obtener el token del header (Bearer Token)
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                error: "Acceso denegado. No se encontró un token de seguridad." 
            });
        }

        try {
            // 2. Validar el token con la clave del .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Inyectamos los datos del usuario en la petición para usarlo en los controladores
            req.user = decoded; 

            // 3. Si la ruta requiere roles específicos, validamos
            if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(req.user.rol)) {
                return res.status(403).json({ 
                    success: false, 
                    error: "Prohibido: No tienes permisos suficientes para esta acción." 
                });
            }

            next(); // Todo bien, adelante.
        } catch (error) {
            return res.status(401).json({ 
                success: false, 
                error: "Token inválido o expirado. Por favor, inicie sesión de nuevo." 
            });
        }
    };
};

module.exports = { verificarAcceso };
