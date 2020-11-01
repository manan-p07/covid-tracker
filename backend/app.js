const express = require('express')
const app = express();
const axios = require('axios');
var cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
app.use(cors());

const port = 5000;

app.post('/get-current-cases', jsonParser, (req, res) => {
  const state = req.body.state.toLowerCase(); // getting state from frontend
  const API_URL = 'https://api.covidtracking.com/v1/states/' + state + '/daily.json';

  axios.get(API_URL) // making request to API
    .then(response => {
        console.log(response);
        // Getting the state, new cases, and total cases
        const state = response.data[0].state;
        const currentCases = response.data[0].positive;
        const totalCases = response.data[0].total;
        const lastUpdate = response.data[0].lastUpdateEt; //format: yyyy/mm/dd

        const yesterdayCases = response.data[1].positive;
        const lastWeekCases = response.data[7].positive;
        const lastThirtyDays = response.data[29].positive;
        const returnData = {
          state: state,
          currentCases: currentCases,
          totalCases: totalCases,
          lastUpdate: lastUpdate,
          yesterdayCases: yesterdayCases,
          lastWeekCases: lastWeekCases,
          lastThirtyDays: lastThirtyDays
        }

        console.log(returnData);
        res.json(returnData);
    })
    .catch(error => console.log('Error', error));
})

app.listen(port, () => {
  console.log(`Covid Tracker listening at http://localhost:${port}`)
})