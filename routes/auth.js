
/*


Ruta: /api/login



*/

const {Router} = require('express');
const { check } = require('express-validator');
const {login, googleSignIn, renewToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();



router.post('/',
[
    check('email','Email obligatorio').isEmail(),
    check('password','El password obligatorio').not().isEmpty(),
    validarCampos
],

  login  
  )


  // login google

  router.post('/google',
[
    
    check('token','El token google obligatorio').not().isEmpty(),
    validarCampos
],

  googleSignIn  
  )




  router.get('/renew',validarJWT,renewToken  
  )













module.exports = router;