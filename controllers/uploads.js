const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { updateImg } = require("../helpers/update-img");
const path = require('path');
const fs = require('fs');


const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    // validar tipo
    if (!tiposValidos.includes(tipo)) {
        res.status(400).json({
            ok: false,
            msg: 'no es medic, hospi, user'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }


    //   procesar iamgen
    const file = req.files.imagen;
    const cutName = file.name.split('.');
    const extensionArchivo = cutName[cutName.length - 1];


    //   vallidar extension
    const extensionValida = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionValida.includes(extensionArchivo)) {
        res.status(400).json({
            ok: false,
            msg: 'extension invalida'
        });
        return;
    }



    //   genrar nombre por defecto
    const fileName = `${uuidv4()}.${extensionArchivo}`;


    // páth para guardar imagen
    const path = `./uploads/${tipo}/${fileName}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
            })
        }



        // actualizar data base
        updateImg(tipo,id,path,fileName);


        res.json({
            ok: true,
            nombreArchivo:fileName,
            msg: 'archivo subido!'
        });
    });


}


const retornarImg=(req,res=response)=>{
    const tipo = req.params.tipo;
    const foto = req.params.foto;


    const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);



    // img por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname,`../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

}


module.exports = {
    fileUpload,
    retornarImg
}