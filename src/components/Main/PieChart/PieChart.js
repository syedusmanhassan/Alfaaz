import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'donut',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      // Extract labels and raw scores from data
      const labels = data.map(item => item.label);
      const scores = data.map(item => item.score);

      // Calculate total score
      const totalScore = scores.reduce((acc, score) => acc + score, 0);

      // Convert raw scores to percentages
      const percentageScores = scores.map(score => (score / totalScore) * 100);

      // Set series and options for the chart
      setChartData({
        series: percentageScores,
        options: {
          chart: {
            type: 'donut',
          },
          labels: labels,
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
      });
    }
  }, [data]); // Dependency on data prop

  return (
    <div id="chart">
      <ReactApexChart options={chartData.options} series={chartData.series} type="donut" />
    </div>
  );
};

export default PieChart;
