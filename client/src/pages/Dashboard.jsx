import React, { Component } from 'react';
import axios from "axios";

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
        
        axios.post("http://localhost:5001/get-current-cases", data).then(res => {
            console.log(res.data)

            // updating state with new data
            this.setState({
                dataRetrieved: "true",
                USState: res.data.state,
                currentCases: res.data.currentCases,
                totalCases: res.data.totalCases,
                lastUpdate: res.data.lastUpdate
            });

            // caching new data into localStorage
            localStorage.setItem("state", this.state.USState);
            localStorage.setItem("oldCases", this.state.currentCases);
            localStorage.setItem("lastUpdate", this.state.lastUpdate);
        });
    }
    
    /* First time user opens the site:
      - enter location
      - receive current cases
      - store location, store current cases as old cases, store date (all in local storage)
    */

  
    
    /* The user opens the site for the second time:
        Retrieve the old location of the user and check if it's the same as current
        store currentcases as oldcases
        retreive the old date
        if old location equals new location find percent increase, if not show the # of cases for the new state
    */
    //var newlocation = 
    
    render() {
        return (
            <>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Enter your state abbreviation: 
                        <input type="text" onChange={this.handleChange}/>
                    </label>
                <input type='submit' value="Get Current Covid Cases" />
                </form>
        <p>{this.state.dataRetrieved ? this.state.currentCases : "Enter a state"}</p>
            </>
        );
    }
}

export default Dashboard;