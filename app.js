const express = require("express");
const fileUpload = require("express-fileupload");
const pdf = require("pdf-parse");
const inquirer = require('inquirer');
const openai = require("openai");

// Set OpenAI API Key
openai.apiKey = "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";

// Initialize app
const app = express();
app.use(fileUpload());

// Set up routing
app.get("/", (req, res) => {
  res.send(`
    <h1>PDF Summary Generator</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="pdf" accept=".pdf">
      <button type="submit">Generate Summary</button>
    </form>
  `);
});

app.post("/upload", (req, res) => {
    // Parse PDF file
    pdf(req.files.pdf.data).then((data) => {
        // Use OpenAI's GPT-3 to generate summary
        openai.createCompletion({
            model: "text-davinci-002",
            prompt: data.text.toString(),
            temperature: 0.5,
            max_tokens: parseInt(data.text.toString().length),
          })
          .then((response) => {
            // Display summary
            res.send(`
              <h1>PDF Summary</h1>
              <p>${response.data.choices[0].text}</p>
            `);
          })
          .catch((error) => {
            // Handle error
            res.send(`
              <h1>Error</h1>
              <p>${error.message}</p>
            `);
          });
      })
      .catch((error) => {
        // Handle error from PDF parsing
        res.send(`
          <h1>Error</h1>
          <p>${error.message}</p>
        `);
      });
  });  

// Start server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
