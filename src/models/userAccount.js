const mongoose = require('mongoose');


var schema = new mongoose.Schema({   
    
accountName: {
    type: String
}

}, {
    timestamps: true,
    versionKey: false 
})

module.exports = mongoose.model('userAccount', schema);;