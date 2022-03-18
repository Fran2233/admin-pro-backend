// punto inicial de la APP!!!
require('dotenv').config();


const express = require('express');
var cors = require('cors')


const {dbConecction} = require('./database/config')

// crear server express
const app = express();



// configurar cors
app.use(cors());


// Lectura y parseo del body
app.use(express.json());



// Base de datos

dbConecction();

// directorio publico
app.use(express.static('public'));


// rutas

// req = lo que se solicita (header-cliente)
// res = lo q el server le responde al client
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/hospitales',require('./routes/hospitales'));
app.use('/api/medicos',require('./routes/medicos'));
app.use('/api/login',require('./routes/auth'));
app.use('/api/todo',require('./routes/busquedas'));
app.use('/api/uploads',require('./routes/uploads'));





// levanto el sv
app.listen(process.env.PORT, () => {
    console.log('server andansadaddo - puerto'+process.env.PORT)
});