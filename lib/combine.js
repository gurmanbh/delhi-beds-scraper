var fs = require('fs');
const path = require('path');
const io = require('indian-ocean');


//Hard coded directory has been used.
//Put your path here...
module.exports = async(dirname, outputName) => {
	const currDir = path.join(dirname);

	// Function to get the filenames present
	// in the directory
	const readdir = (dirname) => {
	  return new Promise((resolve, reject) => {
	    fs.readdir(dirname, (error, filenames) => {
	      if (error) {
	        reject(error);
	      } else {
	        resolve(filenames);
	      }
	    });
	  });
	};

	readdir(currDir).then((filenames) => {
		filenames = filenames.filter(filtercsvFiles);
		let csvData = []
		for (let i = 0; i < filenames.length; i++){
			let csvRead = io.readDataSync(dirname+filenames[i])
			csvData = csvData.concat(csvRead)	
		}
		csvData = [...new Set(csvData)];
		io.writeDataSync(outputName, csvData)
	})
}

const filtercsvFiles = (filename) => {
  return filename.split('.')[1] === 'csv';
};