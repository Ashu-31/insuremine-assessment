
const fileProcessor = require('./fileProcessor')
const PolicyInfo = require('./src/models/policyInfo');
const User = require('./src/models/user')
const Chat = require('./src/models/chat')
const Message = require('./src/models/message')
const { BSON } = require('bson');
const Agenda = require('agenda');
process.env.TZ = 'Asia/Kolkata';
var os = require('os');
const { exec } = require('child_process');
const { Worker} = require('worker_threads');


//Excel upload to load data to the database using worker thread
exports.uploadXLXS = async (req, res) => {
  try {
    if (!req.files || !req.files.media) {
      throw new Error('No files were uploaded.');
    }
    const uploadedFile = req.files.media;
    const uidAndFilename = `${Date.now()}_${uploadedFile.name}`; 
    const parts = uidAndFilename.split('_');
    const fileName = parts.slice(1).join('_'); 
    await uploadedFile.mv(`./uploads/${fileName}`);
    const data = await this.processFile(fileName);
    console.log( typeof fileName)
    console.log('Data saved to MongoDB.', data);
  } catch (error) {
    console.error('Error uploading file:', error.message);
   
  }
};


//function to process the file
exports.processFile = (fileName) => {
  return new Promise((resolve, reject) => {
    console.log(typeof fileName)
    console.log(fileName)
    const worker = new Worker(fileProcessor.fileProcessor(fileName),{workerData:{fileName} } ); // Pass fileName as property of workerData object
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
};

//search function to fetch data from policy table using username
module.exports.search = async(req,res)=>{
  const { firstName } = req.body
  const user = await User.findOne({firstName : firstName});
  if (!user) {
      console.log({ message: 'User not found' });
  }
  const policies = await PolicyInfo.find({ userid: user._id });
  return policies ;
}

//Function to get policyInfo based on userid
module.exports.policyInfo = async (req, res) => {
  try {
      const {userid} = req.body;
      let policyData = await PolicyInfo.aggregate([
          {
           
              $match: { userid: new BSON.ObjectId(userid)}
          },
          {
              $project: {
                  policyNumber: 1,
                  policyStartDate: 1,
                  policyEndDate : 1
              }
          }
      ]);
      return policyData;
  } catch (error) {
      console.error('Error fetching policy data:', error);
     
  }
};

// // Function to check CPU utilization
module.exports.checkCPU = async()=> {
    const cpuUsage = os.loadavg()[0]; // Get 1-minute load average
    console.log(`Current CPU Usage: ${cpuUsage}`);

    if (cpuUsage >= 0.7) { // 70%
        console.log('CPU usage exceeds 70%. Restarting server...');
        restartServer();
    }
}

// Function to restart the server
function restartServer() {
    const child = exec('pm2 restart DESKTOP-S7I3TH4'); //restart the server using pm2
    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    child.on('close', (code) => {
        console.log(`Server restarted with code ${code}`);
    });
}

// Check CPU every 5 seconds
setInterval(module.exports.checkCPU, 5000);


//function to move message based on timestamp from one collection to other collection
const uri = 'mongodb+srv://mashwini099:yZ1nU7bnuyT8c9HV@test-pro-db.adi1sep.mongodb.net/demo?retryWrites=true&w=majority';

let agenda = new Agenda({ db: { address: uri ,collection: 'jobs' }, timezone: 'Asia/Kolkata' });

module.exports.saveMessage = async (req, res) => {
      try {
              const { message, timestamp } = req.body;
          
        // Save the message and timestamp into collection1
        await Chat.create({ message, timestamp: timestamp });
        const timestampUTC = new Date(req.body.timestamp + 'Z');

        // Schedule the job to run at the calculated timestamp
        await agenda.schedule(timestamp, 'transferMessages', { timestamp: timestampUTC });

        console.log('Message saved successfully');
   
    } catch (error) {
        console.error('Error saving message:', error);
  
    }
};

agenda.define('transferMessages', async () => {
  try {
      const timestamp = new Date();

      // Find messages in chat collection with timestamp less than or equal to the provided timestamp
      const messages = await Chat.find({ timestamp: { $lte: timestamp } });
      console.log('Messages to transfer:', messages);

      // Transfer each message to collection2 and delete from collection1
      for (const msg of messages) { 
        const messageId = msg._id; 
        delete msg._id; 
        console.log('Processing message:', msg); 

        const { message, timestamp } = msg;
          // Create a new message in the Message model
          const newMessage = await Message.create({  message, timestamp });
          console.log('New message created:', newMessage);

          // Delete the message from the Chat model
          const deletedMessage = await Chat.deleteOne({ _id: messageId });
          console.log('Message deleted from collection1:', deletedMessage);
      }
  } catch (error) {
      console.error('Error transferring messages:', error);
  }
});

agenda.on('ready', function () {
    agenda.start();
});









