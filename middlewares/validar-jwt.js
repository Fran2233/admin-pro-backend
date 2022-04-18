const jwt = require("jsonwebtoken");
const Usuario = require('../models/usuario');


const validarJWT = (req, res, next) => {

    // leer token
    const token = req.header('x-token');



    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'no hay token'
        });
    }


    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'token invalido'
        });
    }


    next();
}


const validarAdmin = async (req, res, next) => {

    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'usuario no existe'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'usuario no admin'
            });
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'problema server'
        })
    }


}


const validarAdmin_o_mismoUser = async (req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'usuario no existe'
            });
        }

        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'usuario no admin'
            });
        }



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'problema server'
        })
    }


}


module.exports = {
    validarJWT,
    validarAdmin,
    validarAdmin_o_mismoUser
}