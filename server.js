const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

app.use(express.json());

app.use(fileUpload({
    limits: {
        fileSize: 2 * 1024 * 1024 // 2 MB MAX file
    },
    abortOnLimit: true
  }));

const uri ='mongodb+srv://mashwini099:yZ1nU7bnuyT8c9HV@test-pro-db.adi1sep.mongodb.net/demo?retryWrites=true&w=majority';
// Connect to MongoDB Atlas cluster using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Event handlers for Mongoose connection events
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
  // You can now start using Mongoose models and perform database operations
});

// Optional: Handle connection closing
process.on('SIGINT', () => {
  db.close(() => {
    console.log('Connection closed');
    process.exit(0);
  });
});


const router = require("./router"); // Routes   => Routing refers to an application’s endpoints (URIs)
app.use("/api/v1/", router)



const PORT =  5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

