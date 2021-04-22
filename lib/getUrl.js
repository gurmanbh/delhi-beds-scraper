const axios = require('axios');
// const logger = require('./logger');
const io = require('indian-ocean')
module.exports = async(url, variable) => {
  let data, finalData;
  try {
    const response = await axios.get(url);
    data = await response.data;
    eval(data)
    finalData = eval(variable)
  } catch (err) {
    // await logger.error({ title: '⚙️ scraper-demo', text: '❌ Failed to fetch data' });
  }
  
  return finalData;
};
