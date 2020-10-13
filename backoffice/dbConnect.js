const mongoose = require('mongoose')
const dotenv = require('dotenv').config()


async function db_connect() {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },(err, res)=>{
        if (err) throw err;
        console.log('Database connected...')
    })
    
}


module.exports = db_connect


// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('Database connected...'))
// .catch(err => console.log(err));
