const express = require('express')
const app = express();
const axios = require('axios');
var cors = require('cors');
app.use(cors());

const port = 5000;

app.post('/get-current-cases', (req, res) => {
  const state = req.state.toLowerCase(); // getting state from frontend
  const API_URL = 'https://api.covidtracking.com/v1/states/' + state + '/current.json';

  axios.get(API_URL) // making request to API
    .then(res => {
        const response = JSON.parse( // parses response into JSON
          JSON.stringify(res)
        );

        // Getting the state, new cases, and total cases
        const state = response.data.state;
        const currentCases = response.data.positive;
        const totalCases = response.data.total;
        const date = response.data.lastUpdatedEt; //format: yyyy/mm/dd
        

        // Building the final message.
        const message = (
            `Right now, in \
            ${state}, the current total is \
            ${currentCases} cases and there have been \
            ${newCases} new cases as of \
            ${date} EST.`.replace(/\s+/g, ' ')
        );

        console.log(message);
        res.json(message);
    })
    .catch(error => console.log('Error', error));
})

app.listen(port, () => {
  console.log(`Covid Tracker listening at http://localhost:${port}`)
})