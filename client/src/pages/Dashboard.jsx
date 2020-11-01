import React, { Component } from 'react';
import axios from "axios";
import GitHubIcon from "../assets/github-icon.png"
import "./Dashboard.css"

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataIsRetrieved: "false", // if data has been retrieved from backend
            dataRetrieved: {
                USState: "", // the current US state the user is in
                currentCases: 0, // the current # cases in the USState
                yesterdayCases: 0, // the # of cases there were 1 day ago
                lastWeekCases: 0, // the # of cases there were 7 days ago
                lastThirtyDays: 0, // the # of cases there were 30 days ago
                totalCases: 0, // the current total number of cases 
                lastUpdated: "" // the date the current data was retrieved
            },
            changes: {
                lastThirtyDaysChange: 0,
            },
            previousVisit: {
                lastVisited: "" // the last date the user came to the site
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // retrieve data from previous session when page loads
        var oldUSState = localStorage.getItem("location");
        var oldCases = localStorage.getItem("oldCases")
        var lastVisited = localStorage.getItem("lastUpdated");

        this.setState({
            dataIsRetrieved: "false",
            dataRetrieved: {
                USState: oldUSState,
                lastVisited: lastVisited
            }
        })

        var data = {
            state: this.state.dataRetrieved.USState
        };

        
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
        
        // send post response to backend
        axios.post("http://localhost:5000/get-current-cases", data).then(res => {
            console.log(res.data)

            // updating state with new data
            this.setState({
                dataIsRetrieved: "true",
                dataRetrieved: {
                    USState: res.data.state,
                    currentCases: res.data.currentCases,
                    yesterdayCases: res.data.yesterdayCases,
                    lastWeekCases: res.data.lastWeekCases,
                    lastThirtyDays: res.data.lastThirtyDays,
                    totalCases: res.data.totalCases,
                    lastUpdated: res.data.lastUpdate
                }
            });
        console.log(this.state.lastThirtyDays)

        // calculating percent change from last 30 days
        var lastThirtyDays = parseInt(this.state.dataRetrieved.lastThirtyDays);
        var newcases = parseInt(this.state.dataRetrieved.currentCases);
        var lastThirtyDaysChange = ((lastThirtyDays - newcases) / newcases) * 100;
        lastThirtyDaysChange = lastThirtyDaysChange.toFixed(2) // round to two decimal places

        this.setState({
            changes:{
                lastThirtyDaysChange: lastThirtyDaysChange
            }
        })

        console.log(this.state.dataIsRetrieved)
       
        // caching new data into localStorage
        localStorage.setItem("savedState", "true");
        localStorage.setItem("oldUSState", this.state.USState);
        localStorage.setItem("lastUpdated", this.state.lastUpdated);

        console.log(localStorage.getItem("lastUpdated"));
        });

    }
    
    render() {
        if(this.state.dataIsRetrieved === "true") {
            return (
            <div className="dashboard-wrapper"> 
                <h1 className="header">Covid Tracker</h1>
                
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Enter your state abbreviation: 
                        <input type="text" onChange={this.handleChange}/>
                    </label>
                <input type='submit' value="Get COVID Info" />
                </form>
                
                <h4> {this.state.dataRetrieved.USState.length == 2 ? this.state.USState.toUpperCase() : "(State Abb)"} Covid Info: </h4>
                <p>Current Cases as of Today: <b>{this.state.dataRetrieved.currentCases}</b></p>
                <p>Total Cases as of Today: <b>{this.state.dataRetrieved.totalCases}</b></p>
                <p>Percent Change in Covid Cases since Last Month: <b>{this.state.changes.lastThirtyDaysChange}%</b></p>
                <p>Last Updated: {this.state.dataRetrieved.lastUpdated} EST</p>
                
                <div className="credits">
                        <span>Made by Manan, Grace, Sam</span>
                        <a href="https://github.com/samuel-ping/covid-tracker" target="_blank"><img src={GitHubIcon} alt="github icon" /></a>
                    </div>
            </div>
            )
        } else {
            return(
                <div className="dashboard-wrapper"> 
                    <h1 className="header">Covid Tracker</h1>
                    
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Enter your state abbreviation: 
                            <input type="text" onChange={this.handleChange}/>
                        </label>
                    <input type='submit' value="Get COVID Info" />
                    </form>

                    <div className="credits">
                        <span>Made by Manan, Grace, Sam</span>
                        <a href="https://github.com/samuel-ping/covid-tracker" target="_blank"><img src={GitHubIcon} alt="github icon" /></a>
                    </div>
                    
                </div>
            );}
    }
}

export default Dashboard;