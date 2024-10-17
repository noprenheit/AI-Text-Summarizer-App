const express = require('express');
const app = express();
const port = 3000;
const summarizeText = require('./summarize.js');
const extractKeywords = require('./keywords.js');

//Parse JSON bodies
app.use(express.json());
app.use(express.static('public')); //Serve static files from the 'public' directory

//Handle POST requests to the '/summarize' endpoint
app.post('/summarize', (req, res) => {
  //Get the text_to_summarize property from the request body
  const text = req.body.text_to_summarize;

  //Call your summarizeText function, passing in the text from the request
  summarizeText(text)
    .then(summary => {
      //After getting the summary, call extractKeywords with the summary
      extractKeywords(summary)
        .then(keywords => {
          //Send both summary and keywords as a response
          res.send({ summary, keywords });
        })
        .catch(error => {
          console.log("Keyword extraction error: ", error.message);
          res.status(500).send("Error extracting keywords");
        });
    })
    .catch(error => {
      console.log("Summarization error: ", error.message);
      res.status(500).send("Error summarizing text");
    });
});

//Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});