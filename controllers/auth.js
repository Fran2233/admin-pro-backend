const bcrypt = require('bcryptjs');
const { response } = require('express');
const { googleVerify } = require('../helpers/google-verify');
const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');
const Usuario = require('../models/usuario');


const login = async (req, res = response) => {


    const { email, password } = req.body;


    try {
        // Verificar Email
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no valido'
            })
        }

        // Verificar Password
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'PAss invalido'
            })
        }

        // Generar Token
        const token = await generarJWT(usuario.id);


        res.status(200).json({
            ok: true,
            // usuario,
            token,
            menu: getMenuFrontEnd(usuario.role)
        });



    } catch (error) {
        // console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error server login'
        })
    }

}







const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        //  si no existe el user
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // existe user
            usuario = usuarioDB;
            usuario.google = true;

        }

        // guardar en DB

        await usuario.save();

        // generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuario.role)
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'token invalido'
        })
    }

}



  ///////////////RENOVAR TOKEN


const renewToken = async (req, res = response) => {
    const uid = req.uid;
    // generar JWT
    const token = await generarJWT(uid);


    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd(usuario.role)
    });
    
}



module.exports = {
    login,
    googleSignIn,
    renewToken
}