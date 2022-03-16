/*

RUTA:    /api/hospitales

*/


const {Router} = require('express');

const {check} = require('express-validator')
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {  getHospitales,crearHospital,
    updateHospital,
    borrarHospital} = require('../controllers/hospitales')

const router = Router();
router.get( '/',validarJWT,getHospitales );

router.post( '/',
[
    validarJWT,
    check('nombre','Nombre de hospital es obligatorio').not().isEmpty(),
    validarCampos
],
crearHospital );


router.put( '/:id',

[validarJWT],
updateHospital 
);

router.delete( '/:id',borrarHospital);



module.exports  = router;