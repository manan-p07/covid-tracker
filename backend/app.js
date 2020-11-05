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
        // Getting the state, new cases, and total cases
        const state = response.data[0].state;
        const currentCases = response.data[0].positive;
        const totalCases = response.data[0].total;
        const lastUpdate = response.data[0].lastUpdateEt; //format: yyyy/mm/dd

        const yesterdayCases = response.data[1].positive;
        const lastWeekCases = response.data[7].positive;
        const lastThirtyDays = response.data[29].positive;

        // compiling cases from pasts 30 days
        var currentCasesDataSet = {
          dailyCases: []
        };
        var counter = 0;
        for(var dayData in response.data) {
          console.log(dayData)
          currentCasesDataSet.dailyCases[counter] = dayData.positive;
          counter++;
        }

        // console.log(currentCasesDataSet.dailyCases)

        const returnData = {
          state: state,
          currentCases: currentCases,
          totalCases: totalCases,
          lastUpdate: lastUpdate,
          yesterdayCases: yesterdayCases,
          lastWeekCases: lastWeekCases,
          lastThirtyDays: lastThirtyDays,
          dailyData: dayData
        }

        res.json(returnData);
    })
    .catch(error => console.log('Error', error));
})

app.listen(port, () => {
  console.log(`Covid Tracker listening at http://localhost:${port}`)
})