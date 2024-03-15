const mongoose = require('mongoose');


var schema = new mongoose.Schema({   
    
   AgentName: {
    type: String
}

}, {
    timestamps: true,
    versionKey: false 
})

module.exports = mongoose.model('Agent', schema);;