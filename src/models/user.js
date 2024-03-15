const mongoose = require('mongoose');


var schema = new mongoose.Schema({   

    // first name, DOB, address, phone number, state, zip code, email, gender, userType
    
   firstName: {
    type: String
},
dob:{
    type: Date
},
address:{
    type: String
},
phoneNumber:{
    type: String,
     unique: false 
 
},
state:{
    type:String
},
zipCode:{
    type: String
},
email:{
    type:String,
    unique: false 
 
},
gender:{
    type:String,
    enum: ["FEMALE", "MALE"]
},
userType:{
    type:String
}

}, {
    timestamps: true,
    versionKey: false 
})

module.exports = mongoose.model('User', schema);;