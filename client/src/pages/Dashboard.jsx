import React, { Component } from 'react';
import axios from "axios";
import firebase from "firebase"

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataRetrieved: "false",
            oldUSState: "",
            USState: "",
            currentCases: 0,
            totalCases: 0,
            oldCases: 0,
            lastUpdate: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        // firebase.initializeApp({
        //     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        //     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        //     projectId: process.env.REACT_APP_PROJECT_ID
        // })

        // var functions = firebase.functions();
    }

    componentDidMount() {
        // retrieve data from previous session when page loads
        var USState = localStorage.getItem("location");
        var oldCases = localStorage.getItem("oldCases")
        var lastUpdated = localStorage.getItem("lastUpdated");

        this.setState({
            oldUSState: USState,
            currentCases: oldCases,
            oldCases: oldCases,
            lastUpdated: lastUpdated
        })
    
    }

    handleChange(event) {
        //updates state based on user input
        this.setState({USState: event.target.value});
    }
    
    handleSubmit(event) {
        event.preventDefault();

        // creating data JSON to be sent to backend
        var data = {
            state: this.state.USState
        };
        console.log(data);
        
        axios.post("http://localhost:5000/get-current-cases", data).then(res => {
            console.log(res.data)

            // updating state with new data
            this.setState({
                dataRetrieved: "true",
                USState: res.data.state,
                currentCases: res.data.currentCases,
                totalCases: res.data.totalCases,
                lastUpdate: res.data.lastUpdate
            });

        /* First time user opens the site:
            enter location
            receive current cases
            store location, store current cases as old cases, store date (all in local storage) this is done in handleSubmit()
        The user opens the site for the second time:
            Retrieve the old location of the user and check if it's the same as current
            store currentcases as oldcases
            retreive the old date
            if old location equals new location find percent increase, if not show the # of cases for the new state
        */
        var saved = localStorage.getItem('savedState') === 'true';
       
        if(saved){
           var oldState = localStorage.getItem("oldUSState");
           console.log(oldState)
           console.log(this.state.USState)
           if(oldState.localeCompare(this.state.USState) == 0){
                var oldcases = parseInt(localStorage.getItem("oldCases"));
                var newcases = this.state.currentCases;
                console.log("old and new cases below:")
                console.log(oldcases)
                console.log(newcases)
                var difference = ((oldcases - newcases)/newcases)*100;
                
                this.setState({
                    difference: difference,
                    dataRetrieved: "true"
                })
                
                if(difference < 0){
                    var date = localStorage.getItem("lastUpdate");
                    difference = difference * -1;
                    //return <div>Percent Decrease in Covid Cases since {date}: {difference}%</div>;
                }
                else{
                    var date = localStorage.getItem("lastUpdate");
                    //return <div>Percent Increase in Covid Cases since {date}: {difference}%</div>;
                    }
            } else {
                this.setState({
                    dataRetrieved: "false"
                })
            }
            console.log(this.state.dataRetrieved)
       }

        // caching new data into localStorage
        localStorage.setItem("savedState", "true");
        localStorage.setItem("oldUSState", this.state.USState);
        localStorage.setItem("oldCases", this.state.currentCases);
        localStorage.setItem("lastUpdate", this.state.lastUpdate);

        console.log(localStorage.getItem("lastUpdate"));
        });

    }
    
    render() {
        return (
            <>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Enter your state abbreviation: 
                        <input type="text" onChange={this.handleChange}/>
                    </label>
                <input type='submit' value="Get COVID Info" />
                </form>
                <p>Current Cases as of Today: {this.state.currentCases}</p>
                <p>Total Cases as of Today: {this.state.totalCases}</p>
                {this.state.dataRetrieved === "true" ? "Percent Change in Covid Cases since Last Checked: " + this.state.difference + "%" : ""}
                <p>Last Updated: {this.state.lastUpdate}</p>
            </>
        );
    }
}

export default Dashboard;