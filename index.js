// punto inicial de la APP!!!
require('dotenv').config();


const express = require('express');
var cors = require('cors')


const {dbConecction} = require('./database/config')

// crear server express
const app = express();



// configurar cors
app.use(cors());

// Base de datos

dbConecction();







// rutas

// req = lo que se solicita (header-cliente)
// res = lo q el server le responde al client

app.get( '/', (req, res) => {

    res.json({
        ok:true,
        mensaje: 'hola'
    })


} );




// levanto el sv
app.listen(process.env.PORT, () => {
    console.log('server andansadaddo - puerto'+process.env.PORT)
});