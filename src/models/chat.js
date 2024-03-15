const mongoose = require('mongoose');


var schema = new mongoose.Schema({   
    
    message: String,
    timestamp: Date 
})

module.exports = mongoose.model('chat', schema);;