const Usuario = require('../models/usuario');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async (req, res) => {


    const desde = Number(req.query.desde) || 0;

    // const usuarios = await Usuario
    // .find({}, 'nombre email role google ')
    // .skip(desde)
    // .limit(5);


    // const totalRegistro = await Usuario.count();

    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),

         Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    });
}



//////////////////////CREAR USUARIO////////////////////////////

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }

        const usuario = new Usuario(req.body)

        // hash password

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Generar Token
        const token = await generarJWT(usuario.id);

        // guardar user
        await usuario.save();

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: ' error server'
        })
    }

}

//////////////////////UPDATE USUARIO////////////////////////////

const updateUser = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese ID'
            });
        }

        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }
        campos.email = email;

        // Actualizar

        const userActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true })


        res.json({
            ok: true,
            usuario: userActualizado

        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: ' error inesperado'
        })
    }
}




const borrarUser = async (req, res = response) => {
    // Obtengo id que viene en URL
    const uid = req.params.id;

    try {

        const existeUser = await Usuario.findById(uid);

        if (!existeUser) {
            return res.status(404).json({
                ok: false,
                msg: 'user no encontrado con esa ID!',
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'User Eliminado!'
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: ' error inesperado'
        })



    }
}



module.exports = {
    getUsuarios, crearUsuario, updateUser, borrarUser
}