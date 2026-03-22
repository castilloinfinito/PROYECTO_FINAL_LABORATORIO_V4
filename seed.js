const mongoose = require('mongoose');
require('dotenv').config();

// Importación de tus modelos corregidos
const { Usuario, Paciente, Medico, Examen, Resultado } = require('./models/LaboratorioModels');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/laboratorio_pro';

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conexión exitosa para siembra...');

        // Limpieza de colecciones
        await Usuario.deleteMany({});
        await Paciente.deleteMany({});
        await Medico.deleteMany({});
        await Examen.deleteMany({});
        await Resultado.deleteMany({});
        console.log('🗑️ Base de datos limpia.');

        // 1. USUARIOS (No encriptamos aquí, dejamos que el Hook del Modelo lo haga)
        const usuariosData = [
            { username: 'admin', password: '123', rol: 'Admin', cargo: 'Gerente' },
            { username: 'bio', password: '123', rol: 'Bioanalista', cargo: 'Especialista' },
            { username: 'recep', password: '123', rol: 'Recepcion', cargo: 'Atención' },
            { username: 'conta', password: '123', rol: 'Contador', cargo: 'Administración' },
            { username: 'recep2', password: '123', rol: 'Recepcion', cargo: 'Atención Nocturna' }
        ];
        // Usamos .create en lugar de insertMany para que se ejecute el Hook pre('save')
        await Usuario.create(usuariosData);
        console.log('✔️ 5 Usuarios creados (Clave: 123).');

        // 2. PACIENTES (Usando campo 'ci')
        const pacientesData = Array.from({ length: 10 }).map((_, i) => ({
            nombre: `Paciente ${i + 1}`,
            ci: `V-${20000000 + i}`,
            telefono: `0412-${i}554433`
        }));
        const pacientes = await Paciente.insertMany(pacientesData);
        console.log('✔️ 10 Pacientes creados.');

        // 3. MÉDICOS (Usando campo 'mpps')
        const medicosData = Array.from({ length: 10 }).map((_, i) => ({
            nombre: `Dr. Médico ${i + 1}`,
            especialidad: i % 2 === 0 ? 'Internista' : 'General',
            mpps: `MPPS-${1000 + i}`
        }));
        const medicos = await Medico.insertMany(medicosData);
        console.log('✔️ 10 Médicos creados.');

        // 4. EXÁMENES (Usando 'precio', 'numeroOrden' y 'medicoId')
        const examenesData = Array.from({ length: 10 }).map((_, i) => ({
            nombre: `Examen Tipo ${i + 1}`,
            precio: 10 + i,
            numeroOrden: `ORD-00${i}`,
            medicoId: medicos[i]._id
        }));
        const examenes = await Examen.insertMany(examenesData);
        console.log('✔️ 10 Exámenes creados.');

        // 5. RESULTADOS (Usando campos exactos de tu esquema)
        const resultadosData = Array.from({ length: 10 }).map((_, i) => ({
            numeroOrden: `ORD-00${i}`,
            pacienteId: pacientes[i]._id,
            medicoId: medicos[i]._id,
            valor: "Negativo / Normal",
            fecha: new Date()
        }));
        await Resultado.insertMany(resultadosData);
        console.log('✔️ 10 Resultados creados.');

        console.log('\n🚀 ¡Siembra finalizada con éxito!');
        process.exit();
    } catch (error) {
        console.error('❌ Error en el seed:', error);
        process.exit(1);
    }
};

seedDB();