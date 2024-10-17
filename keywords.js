const axios = require('axios');
const qs = require('qs');

//Function to call the keyword extraction API, returns the keywords as a string
async function extractKeywords(text) {
  let data = qs.stringify({
    'extractors': 'entities,nounPhrases',
    'text': text
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.textrazor.com/',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-TextRazor-Key': process.env['TEXTRAZOR_API_KEY']
    },
    data: data
  };

  //Capture the request in a try/catch to check for any errors
  try {
    const response = await axios.request(config);

    
  //console.log("Full Response: ", JSON.stringify(response.data, null, 2));
  //Log the full response for debugging

    let visualKeywords = [];

    //Function to check if a word is a valid noun or adjective (visually descriptive)
    function isValidVisualWord(wordObj) {
      const validPartsOfSpeech = ['NN', 'NNS', 'NNP', 'JJ'];
      //NN: noun
      //NNP: proper noun
      //JJ: adjective
      return validPartsOfSpeech.includes(wordObj.partOfSpeech) && wordObj.token.trim().length > 0;
    }

    //Function to exclude some words from the keywords
    function isImportantVisualPhrase(phrase) {
      const lowerPhrase = phrase.toLowerCase();
      const commonWords = ['i', 'we', 'and', 'but', 'the', 'a', 'to', 'my', 'in', 'at', 'on'];
      //Exclude these common words from the phrase
      //Check if the phrase is not a common word and is longer than 2 characters
      return lowerPhrase.length > 2 && !commonWords.includes(lowerPhrase);
    }

    //Extract entities from the response
    if (response.data && response.data.response && response.data.response.entities) {
      response.data.response.entities.forEach(entity => {
        if (entity.matchedText && isImportantVisualPhrase(entity.matchedText)) {
          visualKeywords.push(entity.matchedText);
        }
      });
    }

    //Loop through all sentences in the response to extract additional descriptive words
    if (response.data.response.sentences) {
      response.data.response.sentences.forEach(sentence => {
        const words = sentence.words;
        const wordsInSentence = words
          .filter(word => isValidVisualWord(word))
          .map(word => word.token.trim());

        wordsInSentence.forEach(word => {
          if (isImportantVisualPhrase(word)) {
            visualKeywords.push(word);
          }
        });
      });
    }

    //Remove duplicate keywords and format them as a clean string
    let uniqueVisualKeywords = [...new Set(visualKeywords)];

    //Log the extracted visual keywords to the console for verification
    console.log("Extracted Visual Keywords: ", uniqueVisualKeywords);

    return uniqueVisualKeywords;
  } catch (err) {
    console.log("Error occurred: ", err);
    return [];
  }
}

//Export the extractKeywords function
module.exports = extractKeywords;