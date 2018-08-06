'use strict';
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/smt400db')
.then(() => {
    console.log('Database connected')
})
.catch(error => {
    console.log(error);
})


module.exports = mongoose;