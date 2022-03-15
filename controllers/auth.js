const bcrypt = require('bcryptjs');
const {response} =  require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');


const login = async(req,res = response) => {


    const {email,password} = req.body;


try {
    // Verificar Email
    const usuario = await Usuario.findOne({email});

    if(!usuario){
        return res.status(404).json({
            ok:false,
            msg: 'Email no valido'
        })
    }

// Verificar Password
const validPassword = bcrypt.compareSync(password, usuario.password);

    if(!validPassword){
        return res.status(400).json({
            ok:false,
            msg: 'PAss invalido'
        })
    }

    // Generar Token
const token = await generarJWT(usuario.id);


    res.status(200).json({
        ok:true,
        usuario,
        token
    })


    
} catch (error) {
    console.log(error);
    res.status(500).json({
        ok:false,
        msg: 'error server login'
    })
}

}



module.exports = {
    login
}