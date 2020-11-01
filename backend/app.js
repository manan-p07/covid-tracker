const express = require('express')
const app = express();
const axios = require('axios');
var cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
app.use(cors());

const port = 5001;

app.post('/get-current-cases', jsonParser, (req, res) => {
  // const the_request = JSON.stringify(req.body);
  // const requestBody = JSON.parse(req.body);
  // console.log(requestBody);
  const state = req.body.state.toLowerCase(); // getting state from frontend
  const API_URL = 'https://api.covidtracking.com/v1/states/' + state + '/current.json';

  axios.get(API_URL) // making request to API
    .then(response => {
        console.log(response);
        // Getting the state, new cases, and total cases
        const state = response.data.state;
        const currentCases = response.data.positive;
        const totalCases = response.data.total;
        const lastUpdate = response.data.lastUpdateEt; //format: yyyy/mm/dd
        
        const returnData = {
          state: state,
          currentCases: currentCases,
          totalCases: totalCases,
          lastUpdate: lastUpdate
        }
        // const returnJSON = JSON.parse(returnData);
        // Building the final message.
        // const message = (
        //     `Right now, in \
        //     ${state}, the current total is \
        //     ${currentCases} cases and there have been \
        //     ${totalCases} new cases as of \
        //     ${date} EST.`.replace(/\s+/g, ' ')
        // );

        console.log(returnData);
        res.json(returnData);
    })
    .catch(error => console.log('Error', error));
})

app.listen(port, () => {
  console.log(`Covid Tracker listening at http://localhost:${port}`)
})