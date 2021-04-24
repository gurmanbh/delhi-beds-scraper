const axios = require('axios');
const io = require('indian-ocean')
module.exports = async(url, variable) => {
  let data, finalData;
  try {
    const response = await axios.get(url);
    data = await response.data;
    eval(data)
    finalData = eval(variable)
  } catch (err) {
    
  }
  
  return finalData;
};
