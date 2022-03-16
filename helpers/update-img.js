const fs = require('fs');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');


const borrarImg = (path) => {

    if (fs.existsSync(path)) {
        // borrar img anterior
        fs.unlinkSync(path);
    }
}

const updateImg = async (tipo, id, path, fileName) => {

    switch (tipo) {
        case 'medicos':
            {
                const medico = await Medico.findById(id);
                if (!medico) {
                    console.log('error medico id');
                    return false;
                }
                const pathOld = `./uploads/medicos/${medico.img}`;
                borrarImg(pathOld);

                medico.img = fileName;
                await medico.save();
                return true;
            }
            break;

        case 'hospitales':
            {
                const hospital = await Hospital.findById(id);
                if (!hospital) {
                    console.log('error hospital id');
                    return false;
                }
                const pathOld = `./uploads/hospitales/${hospital.img}`;
                borrarImg(pathOld);

                hospital.img = fileName;
                await hospital.save();
                return true;
            }

            break;
        case 'usuarios':
            {
                const usuario = await Usuario.findById(id);
                if (!usuario) {
                    console.log('error usuario id');
                    return false;
                }
                const pathOld = `./uploads/medicos/${usuario.img}`;
                borrarImg(pathOld);

                usuario.img = fileName;
                await usuario.save();
                return true;

            }
            break;

        default:
            break;
    }



}


module.exports = {
    updateImg
}