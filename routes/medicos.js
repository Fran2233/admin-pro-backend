/*

    RUTA: api/medicos

*/

const { Router } = require('express');

const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getMedicos, crearMedico,
    updateMedico,
    borrarMedico, 
    getMedicoById} = require('../controllers/medicos')

const router = Router();
router.get('/', validarJWT, getMedicos);

router.post('/',
    [
        validarJWT,
        check('nombre', 'Nombre del medico es obligatorio').not().isEmpty(),
        check('hospital', 'Hospital ID es obligatorio').isMongoId(),

        validarCampos
    ],
    crearMedico);


router.put('/:id',
    [
        validarJWT,
        check('nombre', 'Nombre del medico es obligatorio').not().isEmpty(),
        check('hospital', 'Hospital ID es obligatorio').isMongoId(),
        validarCampos
    ],
    updateMedico
);

router.delete('/:id',validarJWT, borrarMedico);

router.get('/:id',validarJWT, getMedicoById);



module.exports = router;