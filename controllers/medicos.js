const { response } = require('express');
const Medico = require('../models/medico')



const getMedicos = async (req, res = response) => {


    const medicos = await Medico.find().populate('usuario', 'nombre')
        .populate('hospital', 'nombre');
    res.json({
        ok: true,
        medicos
    })
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


const borrarMedico = async(req, res = response) => {


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
    borrarMedico
}