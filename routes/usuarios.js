/*


Ruta: /api/usuarios



*/

const {Router} = require('express');
const {getUsuarios,crearUsuario,updateUser,borrarUser} = require('../controllers/usuarios')
const {check} = require('express-validator')
const router = Router();
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT, validarAdmin, validarAdmin_o_mismoUser } = require('../middlewares/validar-jwt');

router.get( '/',validarJWT,getUsuarios );

router.post( '/',
[

    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    validarCampos

],crearUsuario );


router.put( '/:id',

[
    validarJWT,
    validarAdmin_o_mismoUser,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('role','El rol es obligatorio').not().isEmpty(),
    validarCampos
],
updateUser 
);

router.delete( '/:id',validarJWT,borrarUser);























module.exports  = router;