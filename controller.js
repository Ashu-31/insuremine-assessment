
const service = require('./service');


module.exports.uploadXLXS = async (req, res, next) => {
    try {
      // Call the service to handle the file upload
      const createData = await service.uploadXLXS(req);
      
      // If the service function completes without errors, send a success response
      res.status(200).json({ message: "Data updated successfully", data: createData });
    } catch (error) {
      // If an error occurs, send an error response
      res.status(400).json({ message: error.message });
    }
  };


  
module.exports.search= async (req, res, next) => {
  try {
    const search = await service.search(req);
    res.status(200).json({ message: "searched Data", data: search });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports.policyInfo= async (req, res, next) => {
  try {
    const policyInfo = await service.policyInfo(req);
    res.status(200).json({ message: "policy Data", data: policyInfo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.checkCpu = async (req, res, next) => {
  try {
       service.checkCPU();
    res.status(200).json({ message: "cpu usage"});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports.saveMessage = async (req, res, next) => {
  try {
    const saveData = await service.saveMessage(req);
    res.status(200).json({ message: "msg updated successfully", data: saveData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
  