const textArea = document.getElementById("text_to_summarize");
const submitButton = document.getElementById("submit-button");
const summarizedTextArea = document.getElementById("summary");
const keywordsTextArea = document.getElementById("keywords");

submitButton.disabled = true;

textArea.addEventListener("input", verifyTextLength);
submitButton.addEventListener("click", submitData);

//Function to verify the text length
function verifyTextLength(e) {
  const textarea = e.target;

  //Verify the TextArea value.
  if (textarea.value.length > 200 && textarea.value.length < 100000) {
    //Enable the button when text area has value.
    submitButton.disabled = false;
  } else {
    //Disable the button when text area is empty.a
    submitButton.disabled = true;
  }
}

function submitData(e) {
  //Animation to the submit button
  submitButton.classList.add("submit-button--loading");

  const text_to_summarize = textArea.value;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "text_to_summarize": text_to_summarize
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  //Send the text to the server using fetch API
  fetch('/summarize', requestOptions)
    .then(response => response.json()) //Response contains both summary and keywords
    .then(data => {
      // Update the output text area with the new summary
      summarizedTextArea.value = data.summary;

      // Update the keywords text area with the extracted keywords
      keywordsTextArea.value = data.keywords.join(', ');

      //Stop the animation
      submitButton.classList.remove("submit-button--loading");
    })
    .catch(error => {
      console.log(error.message);
      submitButton.classList.remove("submit-button--loading");
    });
}