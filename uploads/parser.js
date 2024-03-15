const fs = require('fs');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');

function parseFile(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  
  if (extension === 'xlsx') {
    return parseXLSX(fileName);
  } else if (extension === 'csv') {
    return parseCSV(fileName);
  } else {
    throw new Error('Unsupported file format. Only XLSX and CSV files are supported.');
  }
}

function parseXLSX(fileName) {
  const workbook = xlsx.readFile(`./uploads/${fileName}`);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}

function parseCSV(fileName) {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(`./uploads/${fileName}`)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

module.exports = { parseFile };
