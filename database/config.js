const mongoose = require('mongoose');




const dbConecction = async () => {

    

    try {

        await mongoose.connect(process.env.DB_CNN, {

         });

         console.log('db online')
        
    } catch (error) {
            console.log(error)
            throw new Error('error db')
    }
}


module.exports = {
    dbConecction
}