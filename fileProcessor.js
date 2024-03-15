const Agent = require('./src/models/agent');
const User = require('./src/models/user');
const PolicyCarrier = require('./src/models/policyCarrier');
const PolicyCategory = require('./src/models/policyCategory');
const PolicyInfo = require('./src/models/policyInfo');
const UserAccount = require('./src/models/userAccount');
const { parentPort } = require('worker_threads');
const parseFile = require('./uploads/parser.js');


async function fileProcessor(fileName) {
  try {
    const data = parseFile.parseFile(fileName);

for (const agentData of data) {
  try {
       const user = new User({
        firstName: agentData.firstname,
        dob:agentData.dob,
        address:agentData.address,
        phoneNumber:agentData.phone,
        state:agentData.state,
        zipCode:agentData.zip,
        email:agentData.email,
        userType:agentData.userType,
        // gender
    })
    await user.save();
    

    const userAccount = new UserAccount({
        accountName: agentData.account_name
    })
    await userAccount.save();

   const policyCarrier = new PolicyCarrier({
        company_name: agentData.company_name
   })
   await policyCarrier.save();

   const policyInfo = new PolicyInfo({
    policyNumber: agentData.policy_number,
    policyStartDate: agentData.policy_start_date,
    policyEndDate: agentData.policy_end_date,
    // policyCategory: agentData.
    // collectionId:
    // companyCollectionId:
    // userId:
   })
   await policyInfo.save();
   

    const agent = new Agent({
      AgentName: agentData.agent,
     
    });
    await agent.save();


    const policyCategory = new PolicyCategory({
        category_name: agentData.category_name,
    });
    await policyCategory.save();
 
  } catch (error) {
    console.error('Error saving data to database:', error);
  }
}
  } catch (error) {
    return error.message;
  }
}

module.exports = { fileProcessor };
