const functions = require('firebase-functions');
const express = require('express')
const app = express();
const axios = require('axios');
var cors = require('cors');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
app.use(cors());

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

app.post('/get-current-cases', jsonParser, (req, res) => {
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
  
          console.log(returnData);
          res.json(returnData);
      })
      .catch(error => console.log('Error', error));
  })

exports.app = functions.https.onRequest(app);
