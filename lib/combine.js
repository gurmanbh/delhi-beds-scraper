const _ = require('lodash');
var fs = require('fs');
const path = require('path');
const io = require('indian-ocean');
const variable = 'name'
function compare( a, b) {
	a[variable] = a[variable].toUpperCase()
	b[variable] = b[variable].toUpperCase()

  if ( a[variable] < b[variable] ){
    return -1;
  }
  if ( a[variable] > b[variable] ){
    return 1;
  }
  return 0;
}

//Hard coded directory has been used.
//Put your path here...
module.exports = async(dirname, outputName, outputNameTotal) => {
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
		csvData = _.uniqWith(csvData, _.isEqual);
		io.writeDataSync(outputName, csvData.sort(compare).filter(d=>d.name!='ALL'))
		io.writeDataSync(outputNameTotal, csvData.sort(compare).filter(d=>d.name=='ALL'))

	})
}

const filtercsvFiles = (filename) => {
  return filename.split('.')[1] === 'csv';
};