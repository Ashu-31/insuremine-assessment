const mongoose = require('mongoose');


var schema = new mongoose.Schema({   
    
category_name: {
    type: String
}

}, {
    timestamps: true,
    versionKey: false 
})

module.exports = mongoose.model('policyCategory', schema);