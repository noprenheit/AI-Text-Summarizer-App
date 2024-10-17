//Axios framework to call the API
const axios = require('axios');

//Function to call the API, returns the summarized text as a string
async function summarizeText(text) {

  let data = JSON.stringify({
    "inputs": text,
    "parameters": {
      "max_length": 100,
      "min_length": 30
    }
  });

  let config = {
    method: 'post',
    url: 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env['ACCESS_TOKEN']
    },
    data: data
  };

  //Capture the request in a try/catch to check for any errors
  try {
    const response = await axios.request(config);
    //Return the summary text from the response
    return response.data[0].summary_text;
  } catch (err) {
    console.log(err);
  }
}

//Export the summarizeText function
module.exports = summarizeText;