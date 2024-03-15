const mongoose = require('mongoose');


var schema = new mongoose.Schema({   
    
company_name: {
    type: String
}

}, {
    timestamps: true,
    versionKey: false 
})

module.exports = mongoose.model('policyCarrier', schema);;