const { response } = require('express');

const Hospital = require('../models/hospital')



const getHospitales = async (req, res = response) => {
    let desde = Number(req.query.desde) || 0;
    let limit = 5;

    

    if(desde === -1){
        desde = 0;
        limit = 0;
    }
    // const hospitales = await Hospital.find().populate('usuario', 'nombre');


    const [hospitales, total] = await Promise.all([
        Hospital
            .find({}, 'nombre img')
            .populate('usuario','nombre email')
            .skip(desde)
            .limit(limit),

         Hospital.countDocuments()
    ]);


    res.json({
        ok: true,
        hospitales,
        total
    })
}


const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });


    try {
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'error server'
        })
    }






}

const updateHospital = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById(id);


        if (!hospital) {
            res.status(404).json({
                ok: false,
                msg: ' Hospital No encontrado',
                id
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital
            .findByIdAndUpdate(id, cambiosHospital, {
                new: true
            })

        res.json({
            ok: true,
            hospital: hospitalActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error  Hospital'
        })
    }



}







const borrarHospital = async(req, res = response) => {

    const id = req.params.id;
    try {

        const hospital = await Hospital.findById(id);


        if (!hospital) {
            res.status(404).json({
                ok: false,
                msg: ' Hospital No encontrado',
                id
            });
            return;
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Se borro el hospital'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error  Hospital'
        })
    }




}


module.exports = {
    getHospitales, crearHospital,
    updateHospital,
    borrarHospital
}