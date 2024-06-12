import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
          colors: {
            ranges: [{
              from: 0,
              to: Infinity,
              color: '#FF0000' // red color
            }]
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(3); // Format to 3 decimal places
        }
      },
      xaxis: {
        categories: []
      }
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      // Extract labels and scores from data
      const labels = data.map(item => item.label);
      const scores = data.map(item => item.score);

      // Set series and options for the chart
      setChartData({
        series: [{
          data: scores
        }],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              borderRadiusApplication: 'end',
              horizontal: true,
              colors: {
                ranges: [{
                  from: 0,
                  to: Infinity,
                  color: '#FF0000' // red color
                }]
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val.toFixed(3); // Format to 3 decimal places
            }
          },
          xaxis: {
            categories: labels
          }
        }
      });
    }
  }, [data]); // Dependency on data prop

  return (
    <div id="chart">
      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
};

export default BarChart;
