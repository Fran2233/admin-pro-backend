const { response } = require('express');
const Medico = require('../models/medico')



const getMedicos = async (req, res = response) => {
    const desde = Number(req.query.desde) || 0;

    // const medicos = await Medico.find().populate('usuario', 'nombre img')
    //     .populate('hospital', 'nombre img');


    const [medicos, total] = await Promise.all([
        Medico
            .find({}, 'nombre img')
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .skip(desde)
            .limit(5),

        Medico.countDocuments()
    ]);



    res.json({
        ok: true,
        medicos,
        total
    })
}




getMedicoById = async (req, res = response) => {
    const id = req.params.id;


    try {
        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');


        res.json({
            ok: true,
            medico,
            
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: ' problema con url'
        })
    }


}




const crearMedico = async (req, res = response) => {

    const uid = req.uid;

    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Eror server medico'
        })
    }

}




const updateMedico = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById(id);

        if (!medico) {
            res.status(404).json({
                ok: false,
                msg: 'No se encontro medico con esa ID'
            });
        }

        const cambiosMedico = {
            usuario: uid,
            ...req.body
        }


        const medicoDB = await Medico
            .findByIdAndUpdate(id, cambiosMedico, { new: true })


        res.json({
            ok: true,
            medico: medicoDB
        });



    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error update MEdico'
        })
    }





}


const borrarMedico = async (req, res = response) => {


    const id = req.params.id;

    try {

        const medico = await Medico.findById(id);

        if (!medico) {
            res.status(404).json({
                ok: false,
                msg: 'No se encontro medico con esa ID'
            });
            return;
        }


        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'MEdico borrado!!!'
        });



    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error update MEdico'
        })
    }







}


module.exports = {
    getMedicos,
    crearMedico,
    updateMedico,
    borrarMedico,
    getMedicoById
}