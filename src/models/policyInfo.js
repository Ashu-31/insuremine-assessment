const mongoose = require('mongoose');


var schema = new mongoose.Schema({   
   
policyNumber: {
    type: String
},
policyStartDate:{
    type: Date
},
policyEndDate:{
    type: Date
},
policyCategory:{
    type: String
},
collectionId:{
    type:String
},
companyCollectionId:{
    type: String
},
userId:{
    type:String,
    
}

}, {
    timestamps: true,
    versionKey: false 
})

module.exports = mongoose.model('policyInfo', schema);;