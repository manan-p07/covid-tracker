import React, { Component } from 'react';
import {Line} from "@reactchartjs/react-chart.js"
import "./LineChart.css"

const data = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        label: '# of Cases',
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  }

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

class LineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return(
            <>
                <div className="chart-wrapper">
                    <div className='header'>
                        <h1 className='title'>Historic COVID Cases</h1>
                    </div>
                    <Line data={data} options={options} />
                </div>
            </>
        );}
}

export default LineChart;